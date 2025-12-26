"use client";

import { cn } from "@/lib/utils/cn";
import { GamePhase } from "../types";
import { PHASE_COLORS, PHASE_MESSAGES } from "../constants";
import { getPerformanceFeedback } from "../logic/game";

interface ReactionAreaProps {
  phase: GamePhase;
  currentTime: number | null;
  onClick: () => void;
}

export default function ReactionArea({ phase, currentTime, onClick }: ReactionAreaProps) {
  const colorClass = PHASE_COLORS[phase];
  const message = PHASE_MESSAGES[phase];

  return (
    <button
      onClick={onClick}
      className={cn(
        // Fixed dimensions using aspect-ratio - content cannot affect size
        "w-full aspect-[4/3] rounded-2xl",
        // Position relative for absolute content overlay
        "relative overflow-hidden",
        // Styling
        "transition-colors duration-100 cursor-pointer select-none",
        "focus:outline-none",
        colorClass
      )}
      style={{ boxSizing: "border-box" }}
    >
      {/* Absolutely positioned content - completely decoupled from container size */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Main message - fixed line height prevents text rendering shifts */}
        <span
          className="text-white text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
          style={{ minWidth: "200px", textAlign: "center" }}
        >
          {message}
        </span>

        {/* Secondary content area - fixed height container */}
        <div className="h-28 sm:h-36 flex flex-col items-center justify-center mt-4">
          {/* Show reaction time in result phase */}
          {phase === "result" && currentTime !== null && (
            <>
              <span className="text-white text-5xl sm:text-6xl md:text-7xl font-bold font-mono leading-none">
                {currentTime}
                <span className="text-3xl sm:text-4xl md:text-5xl ml-1">ms</span>
              </span>
              <span className="text-white/90 text-lg sm:text-xl mt-3">
                {getPerformanceFeedback(currentTime)}
              </span>
            </>
          )}

          {/* Too early message */}
          {phase === "too_early" && (
            <span className="text-white/90 text-lg sm:text-xl">
              Click to try again
            </span>
          )}

          {/* Idle phase hint */}
          {phase === "idle" && (
            <span className="text-white/80 text-sm sm:text-base">
              Click anywhere to begin
            </span>
          )}

          {/* Waiting phase - no secondary text to avoid visual hints */}
          {phase === "waiting" && (
            <span className="text-white/50 text-sm sm:text-base">
              &nbsp;
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
