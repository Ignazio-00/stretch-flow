"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { useTimer } from "@/hooks/useTimer";
import { formatTime } from "@/lib/utils";
import { getQuickSession } from "@/lib/exercises";

type ExercisePhase =
  | "preparation"
  | "exercise"
  | "completed"
  | "session-complete";

export default function SessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentSession, completeSession, startSession } = useAppStore();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentPhase, setCurrentPhase] =
    useState<ExercisePhase>("preparation");

  const [isLoading, setIsLoading] = useState(true);

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
    resetTimer,
  } = useTimer();

  useEffect(() => {
    const sessionType = searchParams.get("type");

    if (sessionType && !currentSession) {
      // Handle quick session types
      const session = getQuickSession(sessionType);
      if (session) {
        startSession(session.exercises, sessionType);
      } else {
        router.push("/");
        return;
      }
    } else if (!currentSession) {
      router.push("/");
      return;
    }

    setIsLoading(false);
  }, [searchParams, currentSession, router, startSession]);

  useEffect(() => {
    // When timer finishes during exercise phase, mark as completed
    if (timeRemaining === 0 && currentPhase === "exercise") {
      setCurrentPhase("completed");
    }
  }, [timeRemaining, currentPhase]);

  const handleStartExercise = () => {
    const exercise = currentSession?.exercises[currentExerciseIndex];
    if (exercise) {
      setCurrentPhase("exercise");
      startTimer(exercise);
    }
  };

  const handlePauseResume = () => {
    if (isRunning) {
      pauseTimer();
    } else {
      resumeTimer();
    }
  };

  const handleRestartExercise = () => {
    const exercise = currentSession?.exercises[currentExerciseIndex];
    if (exercise) {
      setCurrentPhase("preparation");
      stopTimer();
    }
  };

  const handleNextExercise = () => {
    const nextIndex = currentExerciseIndex + 1;
    const hasMoreExercises =
      nextIndex < (currentSession?.exercises.length || 0);

    if (hasMoreExercises) {
      setCurrentExerciseIndex(nextIndex);
      setCurrentPhase("preparation");
      stopTimer();
    } else {
      setCurrentPhase("session-complete");
      completeSession();
    }
  };

  const handleSkipExercise = () => {
    if (currentPhase === "exercise") {
      stopTimer();
    }
    setCurrentPhase("completed");
  };

  const handleEndSession = () => {
    stopTimer();
    router.push("/");
  };

  const handleContinue = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 dark:text-gray-400">
            Loading your session...
          </p>
        </div>
      </div>
    );
  }

  if (!currentSession) {
    return null;
  }

  if (currentPhase === "session-complete") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="text-4xl text-white"
            >
              🎉
            </motion.span>
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Session Complete!
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Great job! You completed {currentSession.exercises.length} exercise
            {currentSession.exercises.length !== 1 ? "s" : ""} in{" "}
            {formatTime(currentSession.totalDuration)}.
          </p>

          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContinue}
              className="stretch-button-primary w-full"
            >
              Continue
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (currentSession?.context) {
                  router.push(`/session?type=${currentSession.context}`);
                } else {
                  handleContinue();
                }
              }}
              className="stretch-button-secondary w-full"
            >
              Do Another Session
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  const exercise = currentSession.exercises[currentExerciseIndex];
  const totalExercises = currentSession.exercises.length;
  const isLastExercise = currentExerciseIndex === totalExercises - 1;
  const sessionType = searchParams.get("type");

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
                  {currentSession?.context
                    ? currentSession.context.charAt(0).toUpperCase() +
                      currentSession.context.slice(1).replace(/([A-Z])/g, " $1")
                    : `Exercise ${
                        currentExerciseIndex + 1
                      } of ${totalExercises}`}
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
              {currentPhase === "exercise" ? (
                <>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatTime(timeRemaining)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    remaining
                  </p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatTime(exercise.duration)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    duration
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentExerciseIndex}-${currentPhase}`}
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

            {/* Phase-specific content */}
            {currentPhase === "preparation" && (
              <>
                {/* Exercise Preview/Illustration */}
                <div className="flex justify-center">
                  <div className="w-80 h-64 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center p-6">
                      {exercise.imageUrl ? (
                        <img
                          src={exercise.imageUrl}
                          alt={`${exercise.name} demonstration`}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      ) : (
                        <div className="text-center">
                          <span className="text-6xl mb-4 block">🧘‍♀️</span>
                          <p className="text-blue-600 dark:text-blue-400 font-medium">
                            {exercise.name}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* All Instructions */}
                <div className="stretch-card max-w-2xl mx-auto">
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-center">
                      Exercise Steps:
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {exercise.instructions.map((instruction, index) => (
                      <div
                        key={`${exercise.id || exercise.name}-step-${index}`}
                        className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                            {index + 1}
                          </div>
                          <p className="text-gray-900 dark:text-white leading-relaxed">
                            {instruction}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Follow these {exercise.instructions.length} steps during
                      the exercise
                    </p>
                  </div>
                </div>

                {/* Start Button */}
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartExercise}
                    className="stretch-button-primary px-12 py-4 text-lg"
                  >
                    Start Exercise ({formatTime(exercise.duration)})
                  </motion.button>
                </div>
              </>
            )}

            {currentPhase === "exercise" && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                  {/* Exercise Illustration - Left Column */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-8">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {/* Exercise Image */}
                        <div className="aspect-square bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center p-8">
                          {exercise.imageUrl ? (
                            <img
                              src={exercise.imageUrl}
                              alt={`${exercise.name} demonstration`}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          ) : (
                            <div className="text-center">
                              <span className="text-6xl mb-4 block">🧘‍♀️</span>
                              <p className="text-blue-600 dark:text-blue-400 font-medium">
                                {exercise.name}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Exercise Info */}
                        <div className="p-6">
                          <div className="text-center mb-4">
                            <div
                              className={`category-${exercise.category} inline-block mb-2`}
                            >
                              {exercise.category}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                              {exercise.name}
                            </h3>
                          </div>

                          {/* Timer Progress */}
                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                              <span>Progress</span>
                              <span>{formatTime(timeRemaining)} remaining</span>
                            </div>
                            <div className="timer-progress">
                              <div
                                className="timer-progress-bar"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Exercise Controls */}
                          <div className="space-y-3">
                            <button
                              type="button"
                              onClick={handlePauseResume}
                              className="stretch-button-primary w-full"
                            >
                              {isRunning ? "Pause" : "Resume"}
                            </button>
                            <button
                              type="button"
                              onClick={handleSkipExercise}
                              className="stretch-button-ghost w-full text-gray-500 dark:text-gray-400"
                            >
                              Skip Exercise
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Instructions - Right Columns */}
                  <div className="lg:col-span-2">
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          Follow These Steps
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Perform each step smoothly and listen to your body
                        </p>
                      </div>

                      {/* All Instructions Displayed */}
                      <div className="space-y-4">
                        {exercise.instructions.map((instruction, index) => (
                          <motion.div
                            key={`exercise-${
                              exercise.id || exercise.name
                            }-step-${index}`}
                            initial={{ opacity: 0.6, scale: 0.95 }}
                            animate={{
                              opacity: index === currentStep ? 1 : 0.6,
                              scale: index === currentStep ? 1 : 0.95,
                              borderColor:
                                index === currentStep
                                  ? "#10b981"
                                  : "transparent",
                            }}
                            transition={{ duration: 0.3 }}
                            className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                              index === currentStep
                                ? "bg-green-50 dark:bg-green-950 border-green-500 shadow-lg"
                                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm"
                            }`}
                          >
                            {/* Step indicator for current step */}
                            {index === currentStep && (
                              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500" />
                            )}

                            <div className="p-6">
                              <div className="flex items-start space-x-4">
                                <div
                                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-300 ${
                                    index === currentStep
                                      ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg scale-110"
                                      : "bg-gradient-to-r from-gray-400 to-gray-500"
                                  }`}
                                >
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <span
                                      className={`text-sm font-medium transition-colors duration-300 ${
                                        index === currentStep
                                          ? "text-green-600 dark:text-green-400"
                                          : "text-gray-500 dark:text-gray-400"
                                      }`}
                                    >
                                      Step {index + 1} of{" "}
                                      {exercise.instructions.length}
                                      {index === currentStep && " - Active"}
                                    </span>
                                    {index === currentStep && (
                                      <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{
                                          duration: 2,
                                          repeat: Number.POSITIVE_INFINITY,
                                        }}
                                        className="w-3 h-3 bg-green-500 rounded-full"
                                      />
                                    )}
                                  </div>
                                  <p
                                    className={`leading-relaxed transition-colors duration-300 ${
                                      index === currentStep
                                        ? "text-gray-900 dark:text-white text-lg font-medium"
                                        : "text-gray-700 dark:text-gray-300"
                                    }`}
                                  >
                                    {instruction}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Breathing reminder */}
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                        className="text-center py-6"
                      >
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                          💨 Remember to breathe deeply and steadily
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentPhase === "completed" && (
              <>
                {/* Exercise Completed Banner */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center"
                >
                  <div className="flex items-center justify-center space-x-2 text-green-800 dark:text-green-200 mb-4">
                    <span className="text-3xl">✅</span>
                    <span className="text-xl font-medium">
                      Exercise Complete!
                    </span>
                  </div>
                  <p className="text-green-700 dark:text-green-300">
                    Great job completing the {exercise.name}!
                  </p>
                </motion.div>

                {/* Completion Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <button
                    type="button"
                    onClick={handleRestartExercise}
                    className="stretch-button-secondary"
                  >
                    Restart Exercise
                  </button>

                  <button
                    type="button"
                    onClick={handleNextExercise}
                    className="stretch-button-primary px-8"
                  >
                    {isLastExercise ? "Complete Session" : "Next Exercise →"}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
