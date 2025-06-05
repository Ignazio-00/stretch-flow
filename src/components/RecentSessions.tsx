"use client";

import { formatDuration, formatRelativeDate } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";

export default function RecentSessions() {
  const { sessions } = useAppStore();

  // Get the most recent 5 completed sessions
  const recentSessions = sessions
    .filter((session) => session.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  if (recentSessions.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Recent Sessions
        </h2>
        <div className="stretch-card text-center py-12">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🌟</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Start Your First Session
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
            Complete your first stretching session to see your progress and
            build healthy habits.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Recent Sessions
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {recentSessions.map((session, index) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="stretch-card"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">✅</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {session.context
                      ? getContextLabel(session.context)
                      : "Stretch Session"}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatRelativeDate(new Date(session.date))}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDuration(session.totalDuration)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {session.exercises.length} exercise
                  {session.exercises.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {session.exercises.map((exercise) => (
                <div key={exercise.id} className="flex items-center space-x-2">
                  <div className={`category-${exercise.category}`}>
                    {exercise.category}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {exercise.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    ({formatDuration(exercise.duration)})
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {sessions.length > 5 && (
        <div className="mt-6 text-center">
          <button
            type="button"
            className="stretch-button-ghost text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            View All Sessions
          </button>
        </div>
      )}
    </div>
  );
}

function getContextLabel(context: string): string {
  const contextLabels: Record<string, string> = {
    "quick-stretch": "Quick Stretch",
    deskBreak: "Desk Break",
    meetingPrep: "Pre-Meeting",
    afternoonBoost: "Afternoon Boost",
    "morning-routine": "Morning Routine",
    "after-meeting": "Post-Meeting",
  };

  return contextLabels[context] || "Stretch Session";
}
