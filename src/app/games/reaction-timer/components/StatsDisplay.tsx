"use client";

import { GameStats } from "../types";

interface StatsDisplayProps {
  stats: GameStats;
  bestTime: number | null;
}

function StatBox({ label, value, unit = "ms" }: { label: string; value: number | null; unit?: string }) {
  return (
    <div className="bg-gray-200 dark:bg-gray-800 rounded-lg px-3 py-2 text-center min-w-[80px]">
      <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </div>
      <div className="text-xl sm:text-2xl font-bold text-black dark:text-white font-mono">
        {value !== null ? (
          <>
            {value}
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-0.5">{unit}</span>
          </>
        ) : (
          <span className="text-gray-400 dark:text-gray-600">—</span>
        )}
      </div>
    </div>
  );
}

export default function StatsDisplay({ stats, bestTime }: StatsDisplayProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <StatBox label="Best Ever" value={bestTime} />
      <StatBox label="Session Best" value={stats.bestSessionTime} />
      <StatBox label="Average" value={stats.averageTime} />
      <StatBox label="Attempts" value={stats.attemptCount} unit="" />
    </div>
  );
}
