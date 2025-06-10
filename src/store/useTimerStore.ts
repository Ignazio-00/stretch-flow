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
    const { isRunning, timeRemaining, currentExercise, currentStep } = get();
    if (isRunning && timeRemaining > 0) {
      set({ timeRemaining: timeRemaining - 1 });

      // Auto-advance to next step based on time
      if (currentExercise && currentExercise.instructions.length > 1) {
        const stepDuration = Math.floor(
          currentExercise.duration / currentExercise.instructions.length
        );
        const elapsedTime = currentExercise.duration - timeRemaining + 1;
        const expectedStep = Math.min(
          Math.floor(elapsedTime / stepDuration),
          currentExercise.instructions.length - 1
        );

        if (expectedStep !== currentStep) {
          set({ currentStep: expectedStep });
        }
      }
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
