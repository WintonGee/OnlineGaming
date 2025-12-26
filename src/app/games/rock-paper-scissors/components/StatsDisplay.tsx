"use client";

import { cn } from "@/lib/utils/cn";
import { GameStats } from "../types";

interface StatsDisplayProps {
  stats: GameStats;
  totalGames: number;
  winPercentage: number;
}

export default function StatsDisplay({
  stats,
  totalGames,
  winPercentage,
}: StatsDisplayProps) {
  return (
    <div className="flex items-center justify-between gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
      {/* W-L-T compact display */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1">
          <span className="text-green-500 font-bold text-base sm:text-lg font-mono">
            {stats.wins}
          </span>
          <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">W</span>
        </div>
        <span className="text-gray-300 dark:text-gray-600">-</span>
        <div className="flex items-center gap-1">
          <span className="text-red-500 font-bold text-base sm:text-lg font-mono">
            {stats.losses}
          </span>
          <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">L</span>
        </div>
        <span className="text-gray-300 dark:text-gray-600">-</span>
        <div className="flex items-center gap-1">
          <span className="text-yellow-500 font-bold text-base sm:text-lg font-mono">
            {stats.ties}
          </span>
          <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">T</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block" />

      {/* Streak display */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1">
          <span
            className={cn(
              "font-bold text-base sm:text-lg font-mono",
              stats.currentStreak > 0 ? "text-green-500" : "text-gray-400"
            )}
          >
            {stats.currentStreak}
          </span>
          <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            streak
          </span>
        </div>

        {/* Best streak - hidden on very small screens */}
        <div className="hidden xs:flex items-center gap-1">
          <span
            className={cn(
              "font-bold text-base sm:text-lg font-mono",
              stats.bestStreak > 0 ? "text-blue-500" : "text-gray-400"
            )}
          >
            {stats.bestStreak}
          </span>
          <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            best
          </span>
        </div>

        {/* Win % */}
        <div className="flex items-center gap-1">
          <span
            className={cn(
              "font-bold text-base sm:text-lg font-mono",
              totalGames === 0
                ? "text-gray-400"
                : winPercentage >= 50
                ? "text-green-500"
                : "text-red-400"
            )}
          >
            {totalGames > 0 ? `${winPercentage}%` : "-"}
          </span>
        </div>
      </div>
    </div>
  );
}
