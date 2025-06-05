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
  weeklySessionCount: 0,
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

  // Calculate streak - count consecutive days with at least one session
  const currentStreak = calculateDayStreak(completedSessions);
  const longestStreak = Math.max(currentProgress.longestStreak, currentStreak);
  const lastSession = completedSessions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];

  // Calculate sessions this week (Monday to Sunday)
  const weeklySessionCount = calculateWeeklySessionCount(completedSessions);

  return {
    ...currentProgress,
    totalSessions: completedSessions.length,
    totalMinutes,
    currentStreak,
    longestStreak,
    weeklySessionCount,
    lastSessionDate: lastSession ? new Date(lastSession.date) : undefined,
  };
}

// Helper function to calculate consecutive days with sessions
function calculateDayStreak(sessions: StretchSession[]): number {
  if (sessions.length === 0) return 0;

  // Helper to format date as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // Get unique days with sessions
  const sessionDays = new Set(
    sessions.map((session) => formatDate(new Date(session.date)))
  );
  const uniqueDays = Array.from(sessionDays).sort().reverse(); // Most recent first

  if (uniqueDays.length === 0) return 0;

  const today = new Date();
  const todayString = formatDate(today);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = formatDate(yesterday);

  // Check if streak is still active (session today or yesterday)
  const mostRecentDay = uniqueDays[0];
  if (mostRecentDay !== todayString && mostRecentDay !== yesterdayString) {
    return 0; // Streak broken - no session today or yesterday
  }

  // Start counting from today or the most recent session day
  let streak = 0;
  let currentDate = new Date(today);

  // If most recent session was yesterday and we don't have one today, start from yesterday
  if (mostRecentDay === yesterdayString && !sessionDays.has(todayString)) {
    currentDate = new Date(yesterday);
  }

  // Count consecutive days backwards
  while (true) {
    const currentDateString = formatDate(currentDate);

    if (sessionDays.has(currentDateString)) {
      streak++;
      // Move to previous day
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      // No session on this day, streak ends
      break;
    }
  }

  return streak;
}

// Helper function to calculate sessions in the current week
function calculateWeeklySessionCount(sessions: StretchSession[]): number {
  const now = new Date();

  // Get start of current week (Monday)
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  // Get end of current week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // Count sessions in this week
  return sessions.filter((session) => {
    const sessionDate = new Date(session.date);
    return sessionDate >= startOfWeek && sessionDate <= endOfWeek;
  }).length;
}
