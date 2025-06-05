"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { useTimer } from "@/hooks/useTimer";
import { formatTime } from "@/lib/utils";
import { getExerciseById } from "@/lib/exercises";
import type { StretchExercise } from "@/types";

type ExercisePhase = "preparation" | "exercise" | "completed";

export default function ExerciseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { startSession, completeSession } = useAppStore();
  const [exercise, setExercise] = useState<StretchExercise | null>(null);
  const [currentPhase, setCurrentPhase] =
    useState<ExercisePhase>("preparation");
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const {
    isRunning,
    timeRemaining,
    currentStep,
    progress,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
  } = useTimer();

  useEffect(() => {
    const exerciseId = params.id as string;
    const foundExercise = getExerciseById(exerciseId);

    if (foundExercise) {
      setExercise(foundExercise);
    } else {
      router.push("/");
      return;
    }

    setIsLoading(false);
  }, [params.id, router]);

  useEffect(() => {
    // When timer finishes during exercise phase, mark as completed
    if (timeRemaining === 0 && currentPhase === "exercise") {
      setCurrentPhase("completed");

      // Complete the session with this single exercise
      if (exercise) {
        startSession([exercise], `single-${exercise.id}`);
        setTimeout(() => {
          completeSession();
        }, 100);
      }
    }
  }, [timeRemaining, currentPhase, exercise, startSession, completeSession]);

  const handleStartExercise = () => {
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
    if (exercise) {
      setCurrentPhase("preparation");
      setCurrentInstructionIndex(0);
      stopTimer();
    }
  };

  const handleSkipExercise = () => {
    if (currentPhase === "exercise") {
      stopTimer();
    }
    setCurrentPhase("completed");
  };

  const handleGoHome = () => {
    stopTimer();
    router.push("/");
  };

  const handlePreviousInstruction = () => {
    if (currentInstructionIndex > 0) {
      setCurrentInstructionIndex(currentInstructionIndex - 1);
    }
  };

  const handleNextInstruction = () => {
    if (
      exercise &&
      currentInstructionIndex < exercise.instructions.length - 1
    ) {
      setCurrentInstructionIndex(currentInstructionIndex + 1);
    }
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
            Loading exercise...
          </p>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Exercise Not Found
          </h1>
          <button
            onClick={() => router.push("/")}
            className="stretch-button-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleGoHome}
                className="stretch-button-ghost p-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </motion.button>

              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {exercise.name}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <div
                    className={`category-${exercise.category} !text-xs !px-2 !py-1`}
                  >
                    {exercise.category}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {exercise.difficulty}
                  </span>
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
            key={currentPhase}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Exercise Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {exercise.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-4">
                {exercise.description}
              </p>

              {/* Exercise Metadata */}
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                <span>🎯 {exercise.targetMuscles.join(", ")}</span>
                <span>⏱️ {formatTime(exercise.duration)}</span>
                <span>📋 {exercise.instructions.length} steps</span>
              </div>
            </div>

            {/* Phase-specific content */}
            {currentPhase === "preparation" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Exercise Preview/Illustration Placeholder */}
                <div className="flex justify-center">
                  <div className="w-80 h-60 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 rounded-xl border-2 border-dashed border-blue-300 dark:border-blue-700 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-5xl mb-3 block">🧘‍♀️</span>
                      <p className="text-blue-600 dark:text-blue-400 font-medium">
                        Exercise Illustration
                      </p>
                      <p className="text-sm text-blue-500 dark:text-blue-500 mt-1">
                        Coming Soon
                      </p>
                    </div>
                  </div>
                </div>

                {/* Instructions Navigation */}
                <div className="stretch-card max-w-3xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Instructions
                    </h3>
                    <div className="flex items-center space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handlePreviousInstruction}
                        disabled={currentInstructionIndex === 0}
                        className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ←
                      </motion.button>
                      <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[60px] text-center">
                        {currentInstructionIndex + 1} of{" "}
                        {exercise.instructions.length}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleNextInstruction}
                        disabled={
                          currentInstructionIndex ===
                          exercise.instructions.length - 1
                        }
                        className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        →
                      </motion.button>
                    </div>
                  </div>

                  <motion.div
                    key={currentInstructionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-8"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {currentInstructionIndex + 1}
                      </div>
                      <p className="text-lg text-gray-900 dark:text-white leading-relaxed flex-1">
                        {exercise.instructions[currentInstructionIndex]}
                      </p>
                    </div>
                  </motion.div>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Read through all instructions, then start when ready
                    </p>

                    {/* Instruction dots indicator */}
                    <div className="flex justify-center space-x-2 mb-6">
                      {exercise.instructions.map((_, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.2 }}
                          onClick={() => setCurrentInstructionIndex(index)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            index === currentInstructionIndex
                              ? "bg-blue-500"
                              : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Start Button */}
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartExercise}
                    className="stretch-button-primary px-16 py-4 text-lg font-semibold"
                  >
                    Start Exercise ({formatTime(exercise.duration)})
                  </motion.button>
                </div>
              </motion.div>
            )}

            {currentPhase === "exercise" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                {/* Timer Progress */}
                <div className="max-w-lg mx-auto">
                  <div className="timer-progress mb-4">
                    <motion.div
                      className="timer-progress-bar"
                      style={{ width: `${progress}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>0s</span>
                    <span>{formatTime(exercise.duration)}</span>
                  </div>
                </div>

                {/* Current Instruction */}
                <div className="stretch-card max-w-2xl mx-auto">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-center">
                    Current Step:
                  </h3>
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center"
                  >
                    <div className="flex items-center justify-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                        {currentStep + 1}
                      </div>
                      <span className="text-sm text-green-600 dark:text-green-400">
                        Step {currentStep + 1} of {exercise.instructions.length}
                      </span>
                    </div>
                    <p className="text-lg text-gray-900 dark:text-white leading-relaxed">
                      {exercise.instructions[currentStep]}
                    </p>
                  </motion.div>
                </div>

                {/* Exercise Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePauseResume}
                    className="stretch-button-primary px-8"
                  >
                    {isRunning ? "Pause" : "Resume"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSkipExercise}
                    className="stretch-button-ghost text-gray-500 dark:text-gray-400"
                  >
                    Skip Exercise
                  </motion.button>
                </div>
              </motion.div>
            )}

            {currentPhase === "completed" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8 text-center"
              >
                {/* Completion Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-5xl text-white"
                  >
                    ✨
                  </motion.span>
                </motion.div>

                {/* Completion Message */}
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Exercise Complete!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Great job completing the {exercise.name}! Your body will
                    thank you.
                  </p>
                </div>

                {/* Completion Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRestartExercise}
                    className="stretch-button-secondary"
                  >
                    Do It Again
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGoHome}
                    className="stretch-button-primary px-8"
                  >
                    Back to Home
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
