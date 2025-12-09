"use client";

import { Timer, Move, Trophy } from "lucide-react";
import { BestRecords, Difficulty } from "../types";
import { formatTime } from "../utils/formatTime";

interface StatsDisplayProps {
  moves: number;
  time: number;
  bestRecords: BestRecords;
  difficulty: Difficulty;
}

export default function StatsDisplay({
  moves,
  time,
  bestRecords,
  difficulty,
}: StatsDisplayProps) {
  const bestRecord = bestRecords[difficulty];

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-8 text-sm sm:text-base">
      {/* Moves */}
      <div className="flex items-center gap-2">
        <Move className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400" />
        <span className="font-mono font-semibold text-black dark:text-white">
          {moves}
        </span>
        <span className="text-gray-500 dark:text-gray-400 hidden sm:inline">
          moves
        </span>
      </div>

      {/* Time */}
      <div className="flex items-center gap-2">
        <Timer className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400" />
        <span className="font-mono font-semibold text-black dark:text-white">
          {formatTime(time)}
        </span>
      </div>

      {/* Best Record */}
      {bestRecord && (
        <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
          <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="font-mono font-semibold">
            {bestRecord.moves}
          </span>
          <span className="hidden sm:inline text-gray-500 dark:text-gray-400">
            best
          </span>
        </div>
      )}
    </div>
  );
}
