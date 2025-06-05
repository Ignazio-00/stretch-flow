import { useTimerStore } from "@/store/useTimerStore";
import { useEffect, useRef } from "react";

export function useTimer() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const {
    isRunning,
    timeRemaining,
    currentExercise,
    currentStep,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    tick,
    nextStep,
    previousStep,
    resetTimer,
  } = useTimerStore();

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, tick]);

  // Auto-stop when timer reaches 0
  useEffect(() => {
    if (timeRemaining === 0 && isRunning) {
      stopTimer();
    }
  }, [timeRemaining, isRunning, stopTimer]);

  const progress = currentExercise
    ? ((currentExercise.duration - timeRemaining) / currentExercise.duration) *
      100
    : 0;

  return {
    isRunning,
    timeRemaining,
    currentExercise,
    currentStep,
    progress,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    nextStep,
    previousStep,
    resetTimer,
  };
}
