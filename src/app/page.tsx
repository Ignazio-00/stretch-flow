"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { getGreeting, formatTime } from "@/lib/utils";
import { stretchExercises } from "@/lib/exercises";
import type { StretchExercise } from "@/types";

export default function HomePage() {
  const router = useRouter();
  const { user, initializeApp } = useAppStore();
  const [dailyExercises, setDailyExercises] = useState<StretchExercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const greeting = getGreeting();

  useEffect(() => {
    initializeApp();

    // Generate daily exercises (3-5 exercises for today)
    const generateDailyExercises = () => {
      const today = new Date().toDateString();
      const exerciseCount = 4; // Show 4 exercises per day

      // Use date as seed for consistent daily exercises
      const seed = new Date().getDate();
      const shuffled = [...stretchExercises].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, exerciseCount);

      return selected;
    };

    setTimeout(() => {
      setDailyExercises(generateDailyExercises());
      setIsLoading(false);
    }, 500);
  }, [initializeApp]);

  const handleExerciseClick = (exercise: StretchExercise) => {
    router.push(`/exercise/${exercise.id}`);
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
            Loading your daily exercises...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"
              >
                <span className="text-white font-bold text-lg">S</span>
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  StretchFlow
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {greeting}! Ready to stretch?
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Stats Overview */}
              <motion.div whileHover={{ scale: 1.05 }} className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.progress.currentStreak} day streak
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user.progress.weeklySessionCount}/{user.progress.weeklyGoal}{" "}
                  this week
                </p>
              </motion.div>

              {/* Navigation */}
              <div className="flex space-x-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => router.push("/progress")}
                  className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-sm">📊</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => router.push("/settings")}
                  className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-sm">⚙️</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Daily Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Today's Exercises
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </motion.section>

        {/* Daily Exercises Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {dailyExercises.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleExerciseClick(exercise)}
              className="stretch-card cursor-pointer group relative overflow-hidden"
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50 dark:to-blue-950 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`category-${exercise.category} !text-xs !px-2 !py-1`}
                    >
                      {exercise.category}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatTime(exercise.duration)}
                    </span>
                  </div>

                  <motion.div
                    whileHover={{ rotate: 10 }}
                    className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
                  >
                    <span className="text-white text-sm">▶</span>
                  </motion.div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {exercise.name}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {exercise.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>📋 {exercise.instructions.length} steps</span>
                  </div>

                  <motion.div
                    whileHover={{ x: 4 }}
                    className="text-blue-600 dark:text-blue-400 text-sm font-medium"
                  >
                    Start Exercise →
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Sessions
          </h3>

          {/* First row - Original quick sessions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(251, 191, 36, 0.15)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/session?type=quick")}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl p-4 text-left shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">⚡</span>
                <span className="text-sm opacity-90">30-60s</span>
              </div>
              <h4 className="font-semibold">Quick Stretch</h4>
              <p className="text-sm opacity-90">Random quick exercise</p>
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(34, 197, 94, 0.15)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/session?type=desk")}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl p-4 text-left shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">💻</span>
                <span className="text-sm opacity-90">2 min</span>
              </div>
              <h4 className="font-semibold">Desk Break</h4>
              <p className="text-sm opacity-90">Perfect for work breaks</p>
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(168, 85, 247, 0.15)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/session?type=morning")}
              className="bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-xl p-4 text-left shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🌅</span>
                <span className="text-sm opacity-90">90s</span>
              </div>
              <h4 className="font-semibold">Morning Flow</h4>
              <p className="text-sm opacity-90">Energize your day</p>
            </motion.button>
          </div>

          {/* Second row - Additional quick sessions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(99, 102, 241, 0.15)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/session?type=evening")}
              className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl p-4 text-left shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🌙</span>
                <span className="text-sm opacity-90">3 min</span>
              </div>
              <h4 className="font-semibold">Evening Wind-Down</h4>
              <p className="text-sm opacity-90">Relax before bed</p>
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(16, 185, 129, 0.15)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/session?type=posture")}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl p-4 text-left shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🏃‍♀️</span>
                <span className="text-sm opacity-90">4 min</span>
              </div>
              <h4 className="font-semibold">Posture Reset</h4>
              <p className="text-sm opacity-90">Counter desk posture</p>
            </motion.button>
          </div>
        </motion.section>

        {/* Smart Recommendations */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="stretch-card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">🎯</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recommended For You
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Based on the time of day
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(() => {
                const hour = new Date().getHours();
                const recommendations = [];

                if (hour >= 6 && hour < 12) {
                  // Morning recommendations
                  recommendations.push({
                    type: "morning",
                    title: "Start Your Day",
                    subtitle: "Perfect time for energizing stretches",
                    emoji: "🌅",
                    gradient: "from-orange-400 to-pink-500",
                  });
                } else if (hour >= 12 && hour < 17) {
                  // Afternoon recommendations
                  recommendations.push({
                    type: "desk",
                    title: "Midday Reset",
                    subtitle: "Combat desk posture fatigue",
                    emoji: "💻",
                    gradient: "from-green-400 to-blue-500",
                  });
                } else {
                  // Evening recommendations
                  recommendations.push({
                    type: "evening",
                    title: "Wind Down",
                    subtitle: "Prepare your body for rest",
                    emoji: "🌙",
                    gradient: "from-indigo-500 to-blue-600",
                  });
                }

                // Always add posture reset as secondary recommendation
                recommendations.push({
                  type: "posture",
                  title: "Posture Check",
                  subtitle: "Always beneficial",
                  emoji: "🏃‍♀️",
                  gradient: "from-emerald-500 to-teal-600",
                });

                return recommendations.map((rec, index) => (
                  <motion.button
                    key={rec.type}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push(`/session?type=${rec.type}`)}
                    className={`bg-gradient-to-r ${rec.gradient} text-white rounded-lg p-3 text-left flex items-center space-x-3`}
                  >
                    <span className="text-xl">{rec.emoji}</span>
                    <div>
                      <h4 className="font-medium">{rec.title}</h4>
                      <p className="text-xs opacity-90">{rec.subtitle}</p>
                    </div>
                  </motion.button>
                ));
              })()}
            </div>
          </div>
        </motion.section>

        {/* Today's Progress */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="stretch-card bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Today's Progress
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Keep building your streak!
              </p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {user.progress.weeklySessionCount}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                sessions this week
              </p>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
