"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { formatRelativeDate, formatTime } from "@/lib/utils";

export default function ProgressPage() {
  const router = useRouter();
  const { user, sessions, initializeApp } = useAppStore();

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  const completedSessions = sessions.filter((s) => s.completed);
  const recentSessions = completedSessions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const weeklyProgress = Math.min(
    (user.progress.weeklySessionCount / user.progress.weeklyGoal) * 100,
    100
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => router.push("/")}
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
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Your Progress
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Track your stretching journey
                </p>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} className="text-right">
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {user.progress.currentStreak} days
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                current streak
              </p>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Current Streak */}
            <motion.div whileHover={{ y: -4 }} className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Current Streak
                </h3>
                <span className="text-2xl">🔥</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {user.progress.currentStreak}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user.progress.currentStreak === 1 ? "day" : "days"}
              </p>
            </motion.div>

            {/* Total Sessions */}
            <motion.div whileHover={{ y: -4 }} className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Sessions
                </h3>
                <span className="text-2xl">📊</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {user.progress.totalSessions}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                sessions completed
              </p>
            </motion.div>

            {/* Total Time */}
            <motion.div whileHover={{ y: -4 }} className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Time
                </h3>
                <span className="text-2xl">⏱️</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {user.progress.totalMinutes}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                minutes stretched
              </p>
            </motion.div>

            {/* Weekly Goal */}
            <motion.div whileHover={{ y: -4 }} className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Weekly Goal
                </h3>
                <span className="text-2xl">🎯</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.progress.weeklySessionCount}/
                    {user.progress.weeklyGoal}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {Math.round(weeklyProgress)}%
                  </p>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${weeklyProgress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Achievements Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Achievements
          </h2>

          {user.progress.achievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.progress.achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="stretch-card bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-yellow-200 dark:border-yellow-800"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">🏆</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                        {formatRelativeDate(new Date(achievement.unlockedAt))}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="stretch-card text-center py-12">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Achievements Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                Keep stretching to unlock achievements and celebrate your
                progress!
              </p>
            </div>
          )}
        </motion.section>

        {/* Recent Sessions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recent Sessions
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Last 10 sessions
            </span>
          </div>

          {recentSessions.length > 0 ? (
            <div className="space-y-4">
              {recentSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4 }}
                  className="stretch-card"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">✅</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {session.context
                            ? session.context.charAt(0).toUpperCase() +
                              session.context
                                .slice(1)
                                .replace(/([A-Z])/g, " $1")
                            : "Stretch Session"}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatRelativeDate(new Date(session.date))} •{" "}
                          {session.exercises.length} exercises
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatTime(session.totalDuration)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        duration
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="stretch-card text-center py-12">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌟</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Sessions Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto mb-4">
                Complete your first stretching session to start tracking your
                progress.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/")}
                className="stretch-button-primary"
              >
                Start Your First Session
              </motion.button>
            </div>
          )}
        </motion.section>

        {/* Streak Calendar Placeholder */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Streak Calendar
          </h2>

          <div className="stretch-card">
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📅</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Calendar View Coming Soon
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                Visual calendar showing your daily stretching habits and streak
                progress.
              </p>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
