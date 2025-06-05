"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { useTimer } from "@/hooks/useTimer";
import { formatTime } from "@/lib/utils";

type ExercisePhase =
  | "preparation"
  | "exercise"
  | "completed"
  | "session-complete";

export default function SessionPage() {
  const router = useRouter();
  const { currentSession, completeSession } = useAppStore();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentPhase, setCurrentPhase] =
    useState<ExercisePhase>("preparation");
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);

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
    if (!currentSession) {
      router.push("/");
      return;
    }
  }, [currentSession, router]);

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
      setCurrentInstructionIndex(0);
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
      setCurrentInstructionIndex(0);
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

  const handlePreviousInstruction = () => {
    if (currentInstructionIndex > 0) {
      setCurrentInstructionIndex(currentInstructionIndex - 1);
    }
  };

  const handleNextInstruction = () => {
    const exercise = currentSession?.exercises[currentExerciseIndex];
    if (
      exercise &&
      currentInstructionIndex < exercise.instructions.length - 1
    ) {
      setCurrentInstructionIndex(currentInstructionIndex + 1);
    }
  };

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
  const isLastExercise = currentExerciseIndex === totalExercises - 1;

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
                {/* Exercise Preview/Illustration Placeholder */}
                <div className="flex justify-center">
                  <div className="w-64 h-48 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 rounded-xl border-2 border-dashed border-blue-300 dark:border-blue-700 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">🧘‍♀️</span>
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        Exercise illustration
                      </p>
                    </div>
                  </div>
                </div>

                {/* Instructions Navigation */}
                <div className="stretch-card max-w-2xl mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Instructions:
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={handlePreviousInstruction}
                        disabled={currentInstructionIndex === 0}
                        className="stretch-button-ghost p-2 disabled:opacity-50"
                      >
                        ←
                      </button>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {currentInstructionIndex + 1} of{" "}
                        {exercise.instructions.length}
                      </span>
                      <button
                        type="button"
                        onClick={handleNextInstruction}
                        disabled={
                          currentInstructionIndex ===
                          exercise.instructions.length - 1
                        }
                        className="stretch-button-ghost p-2 disabled:opacity-50"
                      >
                        →
                      </button>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                        {currentInstructionIndex + 1}
                      </div>
                      <p className="text-lg text-gray-900 dark:text-white leading-relaxed">
                        {exercise.instructions[currentInstructionIndex]}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Read through all instructions, then start when ready
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

                {/* Current Instruction */}
                <div className="stretch-card max-w-2xl mx-auto">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-center">
                    Current Step:
                  </h3>
                  <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
                    <div className="flex items-center justify-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-medium">
                        {currentStep + 1}
                      </div>
                      <span className="text-sm text-green-600 dark:text-green-400">
                        Step {currentStep + 1} of {exercise.instructions.length}
                      </span>
                    </div>
                    <p className="text-lg text-gray-900 dark:text-white leading-relaxed">
                      {exercise.instructions[currentStep]}
                    </p>
                  </div>
                </div>

                {/* Exercise Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <button
                    type="button"
                    onClick={handlePauseResume}
                    className="stretch-button-primary px-8"
                  >
                    {isRunning ? "Pause" : "Resume"}
                  </button>
                  <button
                    type="button"
                    onClick={handleSkipExercise}
                    className="stretch-button-ghost text-gray-500 dark:text-gray-400"
                  >
                    Skip Exercise
                  </button>
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
