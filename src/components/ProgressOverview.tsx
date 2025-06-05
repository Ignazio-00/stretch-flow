"use client";

import { formatRelativeDate } from "@/lib/utils";
import type { UserProgress } from "@/types";
import { motion } from "framer-motion";

interface ProgressOverviewProps {
  progress: UserProgress;
}

export default function ProgressOverview({ progress }: ProgressOverviewProps) {
  const weeklyProgress = Math.min(
    (progress.totalSessions / progress.weeklyGoal) * 100,
    100
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Your Progress
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Current Streak */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Current Streak
            </h3>
            <span className="text-xl">🔥</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {progress.currentStreak}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {progress.currentStreak === 1 ? "day" : "days"}
          </p>
        </motion.div>

        {/* Total Sessions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Sessions
            </h3>
            <span className="text-xl">📊</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {progress.totalSessions}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            sessions completed
          </p>
        </motion.div>

        {/* Total Minutes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Time
            </h3>
            <span className="text-xl">⏱️</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {progress.totalMinutes}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            minutes stretched
          </p>
        </motion.div>

        {/* Weekly Goal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Weekly Goal
            </h3>
            <span className="text-xl">🎯</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {Math.min(progress.totalSessions, progress.weeklyGoal)}/
                {progress.weeklyGoal}
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

      {/* Recent Achievement */}
      {progress.achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🏆</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Latest Achievement
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {progress.achievements[progress.achievements.length - 1]?.title}{" "}
                -{" "}
                {formatRelativeDate(
                  new Date(
                    progress.achievements[progress.achievements.length - 1]
                      ?.unlockedAt
                  )
                )}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
