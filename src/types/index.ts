export interface StretchExercise {
  id: string;
  name: string;
  description: string;
  duration: number; // in seconds
  instructions: string[];
  category: StretchCategory;
  targetMuscles: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  imageUrl?: string;
  videoUrl?: string;
}

export interface StretchSession {
  id: string;
  date: Date;
  exercises: StretchExercise[];
  totalDuration: number;
  completed: boolean;
  completedAt?: Date;
  context?: string; // e.g., "after-meeting", "morning-routine"
}

export interface UserProgress {
  userId: string;
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  lastSessionDate?: Date;
  weeklyGoal: number; // sessions per week
  weeklySessionCount: number; // sessions completed this week
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  type: "streak" | "duration" | "consistency" | "variety";
}

export interface HabitAnchor {
  id: string;
  name: string;
  description: string;
  trigger: string; // e.g., "Before every meeting", "After lunch"
  exercises: StretchExercise[];
  isActive: boolean;
  reminderEnabled: boolean;
}

export interface AppSettings {
  notifications: {
    enabled: boolean;
    dailyReminder: boolean;
    reminderTime: string; // HH:MM format
    habitAnchors: boolean;
  };
  preferences: {
    theme: "light" | "dark" | "system";
    defaultDuration: number;
    showAnimations: boolean;
    soundEnabled: boolean;
  };
  privacy: {
    shareProgress: boolean;
    analytics: boolean;
  };
}

export type StretchCategory =
  | "neck"
  | "shoulders"
  | "back"
  | "chest"
  | "arms"
  | "wrists"
  | "hips"
  | "legs"
  | "full-body";

export interface AppState {
  user: {
    progress: UserProgress;
    settings: AppSettings;
    habitAnchors: HabitAnchor[];
  };
  sessions: StretchSession[];
  currentSession?: StretchSession;
  exercises: StretchExercise[];
  isLoading: boolean;
  error?: string;
}

export interface TimerState {
  isRunning: boolean;
  timeRemaining: number;
  currentExercise?: StretchExercise;
  currentStep: number;
}
