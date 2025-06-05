"use client";

// import { formatTime } from "@/lib/utils";
import { motion } from "framer-motion";

interface QuickActionCardProps {
  title: string;
  description: string;
  duration: string;
  icon: string;
  color: string;
  onClick: () => void;
}

export default function QuickActionCard({
  title,
  description,
  duration,
  icon,
  color,
  onClick,
}: QuickActionCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="stretch-card cursor-pointer group"
      onClick={onClick}
    >
      <div
        className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
      >
        <span className="text-2xl">{icon}</span>
      </div>

      <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
        {title}
      </h3>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
        {description}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
          {duration}
        </span>

        <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-800 transition-colors">
          <svg
            className="w-3 h-3 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-label="Start exercise"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
