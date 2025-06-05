"use client";

import ProgressOverview from "@/components/ProgressOverview";
import QuickActionCard from "@/components/QuickActionCard";
import RecentSessions from "@/components/RecentSessions";
import { getRandomQuickStretch, quickStretchSessions } from "@/lib/exercises";
import { getGreeting } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();
  const { user, initializeApp, startSession } = useAppStore();
  const greeting = getGreeting();

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  const handleQuickStretch = () => {
    const exercises = getRandomQuickStretch();
    startSession(exercises, "quick-stretch");
    router.push("/session");
  };

  const handleSessionStart = (
    sessionType: keyof typeof quickStretchSessions
  ) => {
    const session = quickStretchSessions[sessionType];
    startSession(session.exercises, sessionType);
    router.push("/session");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  StretchFlow
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {greeting}! Ready to stretch?
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.progress.currentStreak} day streak
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user.progress.totalSessions} sessions
                </p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🔥</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Quick Start
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <QuickActionCard
                title="Quick Stretch"
                description="30-60 second random stretches"
                duration="30-60s"
                icon="⚡"
                color="from-blue-500 to-cyan-500"
                onClick={handleQuickStretch}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <QuickActionCard
                title="Desk Break"
                description="Perfect for work breaks"
                duration="2 min"
                icon="💻"
                color="from-green-500 to-emerald-500"
                onClick={() => handleSessionStart("deskBreak")}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <QuickActionCard
                title="Pre-Meeting"
                description="Energize before meetings"
                duration="90s"
                icon="🚀"
                color="from-purple-500 to-pink-500"
                onClick={() => handleSessionStart("meetingPrep")}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <QuickActionCard
                title="Afternoon Boost"
                description="Beat the afternoon slump"
                duration="3 min"
                icon="☀️"
                color="from-orange-500 to-red-500"
                onClick={() => handleSessionStart("afternoonBoost")}
              />
            </motion.div>
          </div>
        </section>

        {/* Progress Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <ProgressOverview progress={user.progress} />
        </motion.section>

        {/* Recent Sessions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <RecentSessions />
        </motion.section>

        {/* Tips Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 rounded-2xl p-6 border border-blue-200 dark:border-blue-800"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            💡 Stretching Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Hold for 15-30 seconds:</strong> This allows muscles to
                relax and lengthen properly.
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Breathe deeply:</strong> Focus on slow, deep breaths to
                enhance relaxation.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Don&apos;t bounce:</strong> Static stretches are safer
                and more effective.
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Listen to your body:</strong> Stretch should feel good,
                not painful.
              </p>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
