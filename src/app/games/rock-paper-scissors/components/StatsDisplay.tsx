"use client";

import { cn } from "@/lib/utils/cn";
import { GameStats } from "../types";

interface StatsDisplayProps {
  stats: GameStats;
  totalGames: number;
  winPercentage: number;
}

interface StatBoxProps {
  label: string;
  value: string | number;
  highlight?: "positive" | "negative" | "neutral";
  size?: "normal" | "large";
}

function StatBox({ label, value, highlight, size = "normal" }: StatBoxProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg",
        "bg-gray-100 dark:bg-gray-800",
        size === "large" ? "px-4 py-3" : "px-3 py-2"
      )}
    >
      <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <span
        className={cn(
          "font-bold font-mono",
          size === "large" ? "text-xl sm:text-2xl" : "text-lg sm:text-xl",
          highlight === "positive" && "text-green-500",
          highlight === "negative" && "text-red-500",
          highlight === "neutral" && "text-yellow-500",
          !highlight && "text-black dark:text-white"
        )}
      >
        {value}
      </span>
    </div>
  );
}

export default function StatsDisplay({
  stats,
  totalGames,
  winPercentage,
}: StatsDisplayProps) {
  return (
    <div className="space-y-3">
      {/* Main stats row */}
      <div className="grid grid-cols-3 gap-2">
        <StatBox label="Wins" value={stats.wins} highlight="positive" />
        <StatBox label="Losses" value={stats.losses} highlight="negative" />
        <StatBox label="Ties" value={stats.ties} highlight="neutral" />
      </div>

      {/* Secondary stats row */}
      <div className="grid grid-cols-3 gap-2">
        <StatBox
          label="Streak"
          value={stats.currentStreak}
          highlight={stats.currentStreak > 0 ? "positive" : undefined}
        />
        <StatBox
          label="Best Streak"
          value={stats.bestStreak}
          highlight={stats.bestStreak > 0 ? "positive" : undefined}
        />
        <StatBox
          label="Win %"
          value={totalGames > 0 ? `${winPercentage}%` : "-"}
          highlight={
            winPercentage >= 50 ? "positive" : winPercentage > 0 ? "negative" : undefined
          }
        />
      </div>
    </div>
  );
}
