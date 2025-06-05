import type {
  Achievement,
  AppSettings,
  AppState,
  HabitAnchor,
  StretchExercise,
  StretchSession,
  UserProgress,
} from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppStore extends AppState {
  // Actions
  initializeApp: () => void;
  startSession: (exercises: StretchExercise[], context?: string) => void;
  completeSession: () => void;
  updateProgress: (session: StretchSession) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  addHabitAnchor: (anchor: HabitAnchor) => void;
  updateHabitAnchor: (id: string, updates: Partial<HabitAnchor>) => void;
  deleteHabitAnchor: (id: string) => void;
  unlockAchievement: (achievement: Achievement) => void;
  setError: (error: string | undefined) => void;
  setLoading: (loading: boolean) => void;
}

const defaultSettings: AppSettings = {
  notifications: {
    enabled: true,
    dailyReminder: true,
    reminderTime: "09:00",
    habitAnchors: true,
  },
  preferences: {
    theme: "system",
    defaultDuration: 60,
    showAnimations: true,
    soundEnabled: true,
  },
  privacy: {
    shareProgress: false,
    analytics: false,
  },
};

const defaultProgress: UserProgress = {
  userId: "user-1",
  totalSessions: 0,
  totalMinutes: 0,
  currentStreak: 0,
  longestStreak: 0,
  weeklyGoal: 5,
  achievements: [],
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      user: {
        progress: defaultProgress,
        settings: defaultSettings,
        habitAnchors: [],
      },
      sessions: [],
      currentSession: undefined,
      exercises: [],
      isLoading: false,
      error: undefined,

      initializeApp: () => {
        set({ isLoading: false });
      },

      startSession: (exercises, context) => {
        const newSession: StretchSession = {
          id: `session-${Date.now()}`,
          date: new Date(),
          exercises,
          totalDuration: exercises.reduce((sum, ex) => sum + ex.duration, 0),
          completed: false,
          context,
        };

        set({ currentSession: newSession });
      },

      completeSession: () => {
        const { currentSession, sessions, user } = get();
        if (!currentSession) return;

        const completedSession: StretchSession = {
          ...currentSession,
          completed: true,
          completedAt: new Date(),
        };

        const updatedSessions = [...sessions, completedSession];

        // Update progress
        const newProgress = calculateProgress(updatedSessions, user.progress);

        set({
          sessions: updatedSessions,
          currentSession: undefined,
          user: {
            ...user,
            progress: newProgress,
          },
        });
      },

      updateProgress: (session) => {
        const { sessions, user } = get();
        const updatedSessions = sessions.some((s) => s.id === session.id)
          ? sessions.map((s) => (s.id === session.id ? session : s))
          : [...sessions, session];

        const newProgress = calculateProgress(updatedSessions, user.progress);

        set({
          sessions: updatedSessions,
          user: {
            ...user,
            progress: newProgress,
          },
        });
      },

      updateSettings: (settings) => {
        const { user } = get();
        set({
          user: {
            ...user,
            settings: { ...user.settings, ...settings },
          },
        });
      },

      addHabitAnchor: (anchor) => {
        const { user } = get();
        set({
          user: {
            ...user,
            habitAnchors: [...user.habitAnchors, anchor],
          },
        });
      },

      updateHabitAnchor: (id, updates) => {
        const { user } = get();
        set({
          user: {
            ...user,
            habitAnchors: user.habitAnchors.map((anchor) =>
              anchor.id === id ? { ...anchor, ...updates } : anchor
            ),
          },
        });
      },

      deleteHabitAnchor: (id) => {
        const { user } = get();
        set({
          user: {
            ...user,
            habitAnchors: user.habitAnchors.filter(
              (anchor) => anchor.id !== id
            ),
          },
        });
      },

      unlockAchievement: (achievement) => {
        const { user } = get();
        const hasAchievement = user.progress.achievements.some(
          (a) => a.id === achievement.id
        );

        if (!hasAchievement) {
          set({
            user: {
              ...user,
              progress: {
                ...user.progress,
                achievements: [...user.progress.achievements, achievement],
              },
            },
          });
        }
      },

      setError: (error) => set({ error }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "stretchflow-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        sessions: state.sessions,
      }),
    }
  )
);

// Helper function to calculate progress
function calculateProgress(
  sessions: StretchSession[],
  currentProgress: UserProgress
): UserProgress {
  const completedSessions = sessions.filter((s) => s.completed);
  const totalMinutes = Math.round(
    completedSessions.reduce((sum, s) => sum + s.totalDuration, 0) / 60
  );

  // Calculate streak
  const today = new Date();
  const sortedSessions = completedSessions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let currentStreak = 0;
  let checkDate = new Date(today);

  for (const session of sortedSessions) {
    const sessionDate = new Date(session.date);
    const daysDiff = Math.floor(
      (checkDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff <= 1) {
      currentStreak++;
      checkDate = sessionDate;
    } else {
      break;
    }
  }

  const longestStreak = Math.max(currentProgress.longestStreak, currentStreak);
  const lastSession = sortedSessions[0];

  return {
    ...currentProgress,
    totalSessions: completedSessions.length,
    totalMinutes,
    currentStreak,
    longestStreak,
    lastSessionDate: lastSession ? new Date(lastSession.date) : undefined,
  };
}
