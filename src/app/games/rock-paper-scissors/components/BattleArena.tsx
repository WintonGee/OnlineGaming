"use client";

import { cn } from "@/lib/utils/cn";
import { Choice, GamePhase, RoundResult } from "../types";
import { ChoiceIcon } from "./ChoiceButton";
import "../styles.css";

interface BattleArenaProps {
  phase: GamePhase;
  playerChoice: Choice | null;
  aiChoice: Choice | null;
  result: RoundResult | null;
}

const RESULT_MESSAGES: Record<RoundResult, { text: string; color: string }> = {
  win: { text: "You Win!", color: "text-green-500" },
  lose: { text: "You Lose!", color: "text-red-500" },
  tie: { text: "It's a Tie!", color: "text-yellow-500" },
};

export default function BattleArena({
  phase,
  playerChoice,
  aiChoice,
  result,
}: BattleArenaProps) {
  const isAnimating = phase === "countdown" || phase === "reveal";
  const showChoices = phase === "reveal" || phase === "result";
  const showResult = phase === "result" && result;

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center py-8 px-4 rounded-2xl",
        "bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900",
        "border-2 border-gray-200 dark:border-gray-700",
        "min-h-[180px] sm:min-h-[220px]",
        phase === "reveal" && "arena-shake"
      )}
    >
      {/* Idle State */}
      {phase === "idle" && (
        <div className="text-center animate-fade-in">
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-medium">
            Choose your weapon!
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Pick rock, paper, or scissors below
          </p>
        </div>
      )}

      {/* Countdown State - Shaking hands */}
      {phase === "countdown" && playerChoice && (
        <div className="flex items-center justify-center gap-8 sm:gap-16">
          {/* Player's hand (shaking) */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-20 sm:h-20 text-blue-500 hand-shake-left">
              <ChoiceIcon choice={playerChoice} />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-2">
              You
            </span>
          </div>

          {/* VS indicator */}
          <div className="text-2xl sm:text-3xl font-bold text-gray-400 dark:text-gray-500 countdown-pulse">
            VS
          </div>

          {/* AI's hand (question mark, shaking) */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center text-red-500 hand-shake-right">
              <span className="text-4xl sm:text-5xl font-bold">?</span>
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-2">
              AI
            </span>
          </div>
        </div>
      )}

      {/* Reveal/Result State - Both choices visible */}
      {showChoices && playerChoice && aiChoice && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-8 sm:gap-16">
            {/* Player's choice */}
            <div
              className={cn(
                "flex flex-col items-center",
                phase === "reveal" && "clash-left"
              )}
            >
              <div
                className={cn(
                  "w-14 h-14 sm:w-20 sm:h-20 transition-colors duration-300",
                  result === "win"
                    ? "text-green-500"
                    : result === "lose"
                    ? "text-red-400"
                    : "text-yellow-500"
                )}
              >
                <ChoiceIcon choice={playerChoice} />
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-2">
                You
              </span>
            </div>

            {/* Clash effect */}
            <div
              className={cn(
                "text-2xl sm:text-3xl font-bold",
                phase === "reveal" && "clash-burst"
              )}
            >
              💥
            </div>

            {/* AI's choice */}
            <div
              className={cn(
                "flex flex-col items-center",
                phase === "reveal" && "clash-right"
              )}
            >
              <div
                className={cn(
                  "w-14 h-14 sm:w-20 sm:h-20 transition-colors duration-300",
                  result === "lose"
                    ? "text-green-500"
                    : result === "win"
                    ? "text-red-400"
                    : "text-yellow-500"
                )}
              >
                <ChoiceIcon choice={aiChoice} />
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-2">
                AI
              </span>
            </div>
          </div>

          {/* Result message */}
          {showResult && (
            <div
              className={cn(
                "text-2xl sm:text-3xl font-bold mt-4 animate-bounce-in",
                RESULT_MESSAGES[result].color
              )}
            >
              {RESULT_MESSAGES[result].text}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
