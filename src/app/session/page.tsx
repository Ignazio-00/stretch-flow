"use client";

import { useTimer } from "@/hooks/useTimer";
import { formatTime } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SessionPage() {
  const router = useRouter();
  const { currentSession, completeSession } = useAppStore();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showCompleted, setShowCompleted] = useState(false);

  const {
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
    // resetTimer,
  } = useTimer();

  useEffect(() => {
    if (!currentSession) {
      router.push("/");
      return;
    }

    // Start the first exercise
    if (currentSession.exercises.length > 0) {
      startTimer(currentSession.exercises[0]);
    }
  }, [currentSession, router, startTimer]);

  useEffect(() => {
    // When timer finishes, move to next exercise or complete session
    if (timeRemaining === 0 && currentExercise && !isRunning) {
      if (currentExerciseIndex < (currentSession?.exercises.length || 0) - 1) {
        // Move to next exercise
        setTimeout(() => {
          setCurrentExerciseIndex((prev) => prev + 1);
          const nextExercise =
            currentSession?.exercises[currentExerciseIndex + 1];
          if (nextExercise) {
            startTimer(nextExercise);
          }
        }, 1000);
      } else {
        // Complete session
        setTimeout(() => {
          setShowCompleted(true);
          completeSession();
        }, 1000);
      }
    }
  }, [
    timeRemaining,
    currentExercise,
    isRunning,
    currentExerciseIndex,
    currentSession,
    startTimer,
    completeSession,
  ]);

  const handleSkipExercise = () => {
    if (currentExerciseIndex < (currentSession?.exercises.length || 0) - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
      const nextExercise = currentSession?.exercises[currentExerciseIndex + 1];
      if (nextExercise) {
        startTimer(nextExercise);
      }
    } else {
      setShowCompleted(true);
      completeSession();
    }
  };

  const handleEndSession = () => {
    stopTimer();
    router.push("/");
  };

  const handleContinue = () => {
    router.push("/");
  };

  if (!currentSession) {
    return null;
  }

  if (showCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl text-white">🎉</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Session Complete!
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Great job! You completed {currentSession.exercises.length} exercise
            {currentSession.exercises.length !== 1 ? "s" : ""} in{" "}
            {formatTime(currentSession.totalDuration)}.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContinue}
            className="stretch-button-primary w-full"
          >
            Continue
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const exercise = currentSession.exercises[currentExerciseIndex];
  const totalExercises = currentSession.exercises.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={handleEndSession}
                className="stretch-button-ghost p-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-label="Close session"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Exercise {currentExerciseIndex + 1} of {totalExercises}
                </h1>
                <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        ((currentExerciseIndex + 1) / totalExercises) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatTime(timeRemaining)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                remaining
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExerciseIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Exercise Header */}
            <div className="text-center">
              <div
                className={`category-${exercise.category} inline-block mb-4`}
              >
                {exercise.category}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {exercise.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {exercise.description}
              </p>
            </div>

            {/* Timer Progress */}
            <div className="max-w-md mx-auto">
              <div className="timer-progress">
                <div
                  className="timer-progress-bar"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                <span>0s</span>
                <span>{formatTime(exercise.duration)}</span>
              </div>
            </div>

            {/* Instructions */}
            <div className="stretch-card max-w-2xl mx-auto">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Instructions:
              </h3>
              <div className="space-y-3">
                {exercise.instructions.map((instruction, index) => (
                  <div
                    key={`${exercise.id}-instruction-${index}`}
                    className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                      index === currentStep
                        ? "bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500"
                        : "bg-gray-50 dark:bg-gray-800"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        index === currentStep
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <p
                      className={`exercise-instruction ${
                        index === currentStep ? "font-medium" : ""
                      }`}
                    >
                      {instruction}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4">
              <button
                type="button"
                onClick={previousStep}
                disabled={currentStep === 0}
                className="stretch-button-secondary disabled:opacity-50"
              >
                ← Previous Step
              </button>

              <button
                type="button"
                onClick={isRunning ? pauseTimer : resumeTimer}
                className="stretch-button-primary px-8"
              >
                {isRunning ? "Pause" : "Resume"}
              </button>

              <button
                type="button"
                onClick={nextStep}
                disabled={currentStep === exercise.instructions.length - 1}
                className="stretch-button-secondary disabled:opacity-50"
              >
                Next Step →
              </button>
            </div>

            {/* Skip Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleSkipExercise}
                className="stretch-button-ghost text-gray-500 dark:text-gray-400"
              >
                Skip Exercise
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
