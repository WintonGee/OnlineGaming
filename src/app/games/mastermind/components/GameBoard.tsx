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
    <div className="flex flex-wrap gap-1 w-16 justify-center items-center">
      {feedback.map((peg, index) => (
        <div
          key={index}
          className={cn(
            "w-3 h-3 rounded-full",
            peg === "correct" && "bg-black dark:bg-white",
            peg === "wrongPosition" && "bg-gray-400 dark:bg-gray-500",
            peg === "empty" && "bg-gray-200 dark:bg-gray-700"
          )}
          aria-label={
            peg === "correct"
              ? "correct position"
              : peg === "wrongPosition"
              ? "wrong position"
              : "no match"
          }
        />
      ))}
    </div>
  );
}

function GuessRow({
  pegs,
  feedback,
  isCurrentGuess = false,
  selectedSlot,
  onSlotClick,
  showFeedback = false,
}: {
  pegs: (PegColor | null)[];
  feedback?: FeedbackPeg[];
  isCurrentGuess?: boolean;
  selectedSlot?: number;
  onSlotClick?: (index: number) => void;
  showFeedback?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg transition-colors",
        isCurrentGuess && "bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-400 dark:ring-blue-500",
        !isCurrentGuess && "bg-white dark:bg-gray-800"
      )}
    >
      {/* Pegs */}
      <div className="flex gap-2 sm:gap-3">
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
      {showFeedback && feedback && (
        <div className="ml-2 sm:ml-4">
          <FeedbackPegs feedback={feedback} />
        </div>
      )}
      {!showFeedback && (
        <div className="ml-2 sm:ml-4 w-16" />
      )}
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
    <div className="w-full max-w-md mx-auto">
      {/* Secret Code Row */}
      <div className="mb-6">
        <div className="text-center mb-2">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Secret Code
          </h3>
        </div>
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 p-4 rounded-lg shadow-lg">
          <div className="flex gap-2 sm:gap-3 justify-center">
            {gameOver ? (
              // Show the actual secret code when game is over
              secretCode.map((color, index) => (
                <ColorPeg key={index} color={color} size="md" />
              ))
            ) : (
              // Show question marks while playing
              Array.from({ length: CODE_LENGTH }).map((_, index) => (
                <div
                  key={index}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 font-bold text-lg shadow-md"
                >
                  ?
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-gray-300 dark:border-gray-600 mb-6" />

      {/* Guesses Section */}
      <div className="space-y-2">
        {/* Completed guesses */}
        {guesses.map((guess, index) => (
          <GuessRow
            key={index}
            pegs={guess.pegs}
            feedback={guess.feedback}
            showFeedback
          />
        ))}

        {/* Current guess row (if game not over) */}
        {!gameOver && (
          <GuessRow
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
            pegs={Array(CODE_LENGTH).fill(null)}
          />
        ))}
      </div>

      {/* Attempt counter */}
      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Attempt {Math.min(currentAttempt + (gameOver ? 0 : 1), MAX_ATTEMPTS)} / {MAX_ATTEMPTS}
      </div>
    </div>
  );
}
