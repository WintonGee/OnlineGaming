"use client";

import { cn } from "@/lib/utils/cn";
import { GameStats } from "../types";

interface StatsDisplayProps {
  stats: GameStats;
  totalGames: number;
  winPercentage: number;
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color?: "green" | "red" | "yellow" | "blue";
}) {
  return (
    <div className="bg-gray-200 dark:bg-gray-800 rounded-lg px-3 py-2 text-center min-w-[70px] sm:min-w-[80px]">
      <div className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </div>
      <div
        className={cn(
          "text-xl sm:text-2xl font-bold font-mono",
          color === "green" && "text-green-500",
          color === "red" && "text-red-500",
          color === "yellow" && "text-yellow-500",
          color === "blue" && "text-blue-500",
          !color && "text-black dark:text-white"
        )}
      >
        {value}
      </div>
    </div>
  );
}

export default function StatsDisplay({
  stats,
  totalGames,
  winPercentage,
}: StatsDisplayProps) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
      <StatBox label="Wins" value={stats.wins} color="green" />
      <StatBox label="Losses" value={stats.losses} color="red" />
      <StatBox label="Ties" value={stats.ties} color="yellow" />
      <StatBox
        label="Streak"
        value={stats.currentStreak}
        color={stats.currentStreak > 0 ? "green" : undefined}
      />
      <StatBox
        label="Best"
        value={stats.bestStreak}
        color={stats.bestStreak > 0 ? "blue" : undefined}
      />
      <StatBox
        label="Win %"
        value={totalGames > 0 ? `${winPercentage}%` : "—"}
        color={
          totalGames === 0
            ? undefined
            : winPercentage >= 50
            ? "green"
            : "red"
        }
      />
    </div>
  );
}
