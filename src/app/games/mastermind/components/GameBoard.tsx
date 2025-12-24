"use client";

import { PegColor, Guess, FeedbackPeg } from "../types";
import { MAX_ATTEMPTS, CODE_LENGTH } from "../constants";
import ColorPeg from "./ColorPeg";
import { cn } from "@/lib/utils/cn";

interface GameBoardProps {
  guesses: Guess[];
  currentGuess: (PegColor | null)[];
  selectedSlot: number;
  onSlotClick: (index: number) => void;
  gameOver: boolean;
  secretCode: PegColor[];
}

function FeedbackPegs({ feedback }: { feedback: FeedbackPeg[] }) {
  return (
    <div className="flex gap-1">
      {feedback.map((peg, index) => (
        <div
          key={index}
          className={cn(
            "w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all",
            peg === "correct" && "bg-green-500 dark:bg-green-600",
            peg === "wrongPosition" && "bg-yellow-500 dark:bg-yellow-600",
            peg === "empty" && "bg-gray-300 dark:bg-gray-600"
          )}
          aria-label={
            peg === "correct"
              ? "correct position"
              : peg === "wrongPosition"
              ? "wrong position"
              : "no match"
          }
        >
          {peg === "correct" && (
            <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

function GuessRow({
  rowNumber,
  pegs,
  feedback,
  isCurrentGuess = false,
  selectedSlot,
  onSlotClick,
  showFeedback = false,
  isEmpty = false,
}: {
  rowNumber: number;
  pegs: (PegColor | null)[];
  feedback?: FeedbackPeg[];
  isCurrentGuess?: boolean;
  selectedSlot?: number;
  onSlotClick?: (index: number) => void;
  showFeedback?: boolean;
  isEmpty?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 py-2 px-3 rounded-lg transition-all",
        isCurrentGuess && "bg-blue-50 dark:bg-blue-950/40 ring-2 ring-blue-400 dark:ring-blue-500",
        !isCurrentGuess && !isEmpty && "bg-gray-50 dark:bg-gray-900/50",
        isEmpty && "opacity-40"
      )}
    >
      {/* Row number */}
      <div className="w-5 flex-shrink-0">
        <span className={cn(
          "text-xs font-medium tabular-nums",
          isCurrentGuess ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-600"
        )}>
          {rowNumber}
        </span>
      </div>

      {/* Pegs */}
      <div className="flex gap-2">
        {pegs.map((color, index) => (
          <ColorPeg
            key={index}
            color={color}
            size="md"
            isSelected={isCurrentGuess && selectedSlot === index}
            isClickable={isCurrentGuess}
            onClick={isCurrentGuess && onSlotClick ? () => onSlotClick(index) : undefined}
          />
        ))}
      </div>

      {/* Feedback */}
      <div className="ml-auto pl-3">
        {showFeedback && feedback ? (
          <FeedbackPegs feedback={feedback} />
        ) : (
          <div className="w-[62px] h-3.5" />
        )}
      </div>
    </div>
  );
}

export default function GameBoard({
  guesses,
  currentGuess,
  selectedSlot,
  onSlotClick,
  gameOver,
  secretCode,
}: GameBoardProps) {
  const currentAttempt = guesses.length;
  const remainingAttempts = MAX_ATTEMPTS - currentAttempt - (gameOver ? 0 : 1);

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Secret Code Row */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Secret Code
          </span>
          {!gameOver && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Crack the code!
            </span>
          )}
        </div>
        <div className={cn(
          "flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed",
          gameOver
            ? "border-transparent bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30"
            : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"
        )}>
          {gameOver ? (
            secretCode.map((color, index) => (
              <ColorPeg key={index} color={color} size="md" />
            ))
          ) : (
            Array.from({ length: CODE_LENGTH }).map((_, index) => (
              <div
                key={index}
                className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center"
              >
                <span className="text-gray-400 dark:text-gray-600 font-bold text-sm">?</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Guesses Section */}
      <div className="space-y-1.5">
        {/* Completed guesses */}
        {guesses.map((guess, index) => (
          <GuessRow
            key={index}
            rowNumber={index + 1}
            pegs={guess.pegs}
            feedback={guess.feedback}
            showFeedback
          />
        ))}

        {/* Current guess row (if game not over) */}
        {!gameOver && (
          <GuessRow
            rowNumber={currentAttempt + 1}
            pegs={currentGuess}
            isCurrentGuess
            selectedSlot={selectedSlot}
            onSlotClick={onSlotClick}
          />
        )}

        {/* Empty rows for remaining attempts */}
        {Array.from({ length: remainingAttempts }).map((_, index) => (
          <GuessRow
            key={`empty-${index}`}
            rowNumber={currentAttempt + 2 + index}
            pegs={Array(CODE_LENGTH).fill(null)}
            isEmpty
          />
        ))}
      </div>

      {/* Progress indicator */}
      <div className="mt-4 flex items-center justify-between px-1">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Attempt {Math.min(currentAttempt + (gameOver ? 0 : 1), MAX_ATTEMPTS)} of {MAX_ATTEMPTS}
        </span>
        <div className="flex gap-0.5">
          {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-colors",
                i < currentAttempt && "bg-gray-400 dark:bg-gray-500",
                i === currentAttempt && !gameOver && "bg-blue-500",
                i > currentAttempt && "bg-gray-200 dark:bg-gray-800"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
