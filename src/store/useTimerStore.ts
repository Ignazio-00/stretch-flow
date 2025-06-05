import type { StretchExercise, TimerState } from "@/types";
import { create } from "zustand";

interface TimerStore extends TimerState {
  // Actions
  startTimer: (exercise: StretchExercise) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  tick: () => void;
  nextStep: () => void;
  previousStep: () => void;
  resetTimer: () => void;
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  isRunning: false,
  timeRemaining: 0,
  currentExercise: undefined,
  currentStep: 0,

  startTimer: (exercise) => {
    set({
      isRunning: true,
      timeRemaining: exercise.duration,
      currentExercise: exercise,
      currentStep: 0,
    });
  },

  pauseTimer: () => {
    set({ isRunning: false });
  },

  resumeTimer: () => {
    set({ isRunning: true });
  },

  stopTimer: () => {
    set({
      isRunning: false,
      timeRemaining: 0,
      currentExercise: undefined,
      currentStep: 0,
    });
  },

  tick: () => {
    const { isRunning, timeRemaining } = get();
    if (isRunning && timeRemaining > 0) {
      set({ timeRemaining: timeRemaining - 1 });
    } else if (timeRemaining === 0) {
      set({ isRunning: false });
    }
  },

  nextStep: () => {
    const { currentExercise, currentStep } = get();
    if (
      currentExercise &&
      currentStep < currentExercise.instructions.length - 1
    ) {
      set({ currentStep: currentStep + 1 });
    }
  },

  previousStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  resetTimer: () => {
    const { currentExercise } = get();
    if (currentExercise) {
      set({
        isRunning: false,
        timeRemaining: currentExercise.duration,
        currentStep: 0,
      });
    }
  },
}));
