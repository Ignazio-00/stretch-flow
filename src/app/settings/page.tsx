"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";

export default function SettingsPage() {
  const router = useRouter();
  const { user, updateSettings, initializeApp } = useAppStore();
  const [localSettings, setLocalSettings] = useState(user.settings);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  useEffect(() => {
    setLocalSettings(user.settings);
  }, [user.settings]);

  const handleToggle = (section: string, key: string, value: boolean) => {
    const newSettings = {
      ...localSettings,
      [section]: {
        ...localSettings[section as keyof typeof localSettings],
        [key]: value,
      },
    };
    setLocalSettings(newSettings);
    updateSettings(newSettings);
  };

  const handleNumberChange = (section: string, key: string, value: number) => {
    const newSettings = {
      ...localSettings,
      [section]: {
        ...localSettings[section as keyof typeof localSettings],
        [key]: value,
      },
    };
    setLocalSettings(newSettings);
    updateSettings(newSettings);
  };

  const handleStringChange = (section: string, key: string, value: string) => {
    const newSettings = {
      ...localSettings,
      [section]: {
        ...localSettings[section as keyof typeof localSettings],
        [key]: value,
      },
    };
    setLocalSettings(newSettings);
    updateSettings(newSettings);
  };

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
                  Settings
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Customize your StretchFlow experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notifications */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Notifications
          </h2>

          <div className="stretch-card space-y-6">
            {/* Enable Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Enable Notifications
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive stretch reminders and progress updates
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  handleToggle(
                    "notifications",
                    "enabled",
                    !localSettings.notifications.enabled
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  localSettings.notifications.enabled
                    ? "bg-blue-600"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.notifications.enabled
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </motion.button>
            </div>

            {/* Daily Reminder */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Daily Reminder
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get reminded to stretch every day
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  handleToggle(
                    "notifications",
                    "dailyReminder",
                    !localSettings.notifications.dailyReminder
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  localSettings.notifications.dailyReminder
                    ? "bg-blue-600"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
                disabled={!localSettings.notifications.enabled}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.notifications.dailyReminder
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </motion.button>
            </div>

            {/* Reminder Time */}
            {localSettings.notifications.dailyReminder && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-between"
              >
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Reminder Time
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    When should we remind you to stretch?
                  </p>
                </div>
                <input
                  type="time"
                  value={localSettings.notifications.reminderTime}
                  onChange={(e) =>
                    handleStringChange(
                      "notifications",
                      "reminderTime",
                      e.target.value
                    )
                  }
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                />
              </motion.div>
            )}

            {/* Habit Anchors */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Habit Anchor Reminders
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get notified based on your daily routines
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  handleToggle(
                    "notifications",
                    "habitAnchors",
                    !localSettings.notifications.habitAnchors
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  localSettings.notifications.habitAnchors
                    ? "bg-blue-600"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
                disabled={!localSettings.notifications.enabled}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.notifications.habitAnchors
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Preferences */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Preferences
          </h2>

          <div className="stretch-card space-y-6">
            {/* Theme */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Theme
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose your preferred appearance
                </p>
              </div>
              <select
                value={localSettings.preferences.theme}
                onChange={(e) =>
                  handleStringChange("preferences", "theme", e.target.value)
                }
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            {/* Default Duration */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Default Session Duration
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Preferred length for quick sessions
                </p>
              </div>
              <select
                value={localSettings.preferences.defaultDuration}
                onChange={(e) =>
                  handleNumberChange(
                    "preferences",
                    "defaultDuration",
                    parseInt(e.target.value)
                  )
                }
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              >
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
                <option value={120}>2 minutes</option>
                <option value={180}>3 minutes</option>
                <option value={300}>5 minutes</option>
              </select>
            </div>

            {/* Show Animations */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Show Animations
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enable smooth transitions and animations
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  handleToggle(
                    "preferences",
                    "showAnimations",
                    !localSettings.preferences.showAnimations
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  localSettings.preferences.showAnimations
                    ? "bg-blue-600"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.preferences.showAnimations
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </motion.button>
            </div>

            {/* Sound Enabled */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Sound Effects
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Play sounds for timers and notifications
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  handleToggle(
                    "preferences",
                    "soundEnabled",
                    !localSettings.preferences.soundEnabled
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  localSettings.preferences.soundEnabled
                    ? "bg-blue-600"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.preferences.soundEnabled
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Privacy */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Privacy
          </h2>

          <div className="stretch-card space-y-6">
            {/* Share Progress */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Share Progress
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Allow sharing of your progress with friends
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  handleToggle(
                    "privacy",
                    "shareProgress",
                    !localSettings.privacy.shareProgress
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  localSettings.privacy.shareProgress
                    ? "bg-blue-600"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.privacy.shareProgress
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </motion.button>
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Usage Analytics
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Help improve StretchFlow by sharing anonymous usage data
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  handleToggle(
                    "privacy",
                    "analytics",
                    !localSettings.privacy.analytics
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  localSettings.privacy.analytics
                    ? "bg-blue-600"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.privacy.analytics
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Habit Anchors */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Habit Anchors
          </h2>

          <div className="stretch-card">
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚓</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Habit Anchors Coming Soon
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                Link your stretching habits to daily activities like "after
                checking email" or "before lunch".
              </p>
            </div>
          </div>
        </motion.section>

        {/* About */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            About
          </h2>

          <div className="stretch-card">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                StretchFlow
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Version 1.0.0
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                A modern Progressive Web App for daily micro-stretching
                exercises. Built with Next.js, TypeScript, and Framer Motion.
              </p>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
