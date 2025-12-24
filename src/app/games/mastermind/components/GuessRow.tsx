"use client";

import { Guess, PegColor, FeedbackPeg } from "../types";
import { COLOR_CLASSES } from "../constants";
import { cn } from "@/lib/utils/cn";
import ColorPeg from "./ColorPeg";

interface GuessRowProps {
  guess: Guess | null;
  isCurrentRow: boolean;
  currentGuess: (PegColor | null)[];
  selectedSlot: number;
  onSlotClick: (index: number) => void;
  rowNumber: number;
}

export default function GuessRow({
  guess,
  isCurrentRow,
  currentGuess,
  selectedSlot,
  onSlotClick,
  rowNumber,
}: GuessRowProps) {
  // Determine which pegs to display
  const displayPegs = guess ? guess.pegs : currentGuess;
  const feedbackPegs = guess ? guess.feedback : Array(4).fill("empty");

  const renderFeedbackPeg = (feedback: FeedbackPeg, index: number) => {
    const baseClasses = cn(
      "rounded-full transition-all duration-200",
      "w-3 h-3 sm:w-3.5 sm:h-3.5"
    );

    if (feedback === "correct") {
      return (
        <div
          key={index}
          className={cn(
            baseClasses,
            "bg-gray-900 dark:bg-white shadow-sm"
          )}
          aria-label="Correct position and color"
        />
      );
    }

    if (feedback === "wrongPosition") {
      return (
        <div
          key={index}
          className={cn(
            baseClasses,
            "border-2 border-gray-900 dark:border-white bg-transparent"
          )}
          aria-label="Correct color, wrong position"
        />
      );
    }

    // Empty feedback peg
    return (
      <div
        key={index}
        className={cn(
          baseClasses,
          "bg-gray-300 dark:bg-gray-600"
        )}
        aria-label="No match"
      />
    );
  };

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {/* Row number */}
      <div className="w-6 sm:w-8 flex items-center justify-center">
        <span className="text-sm sm:text-base font-semibold text-gray-600 dark:text-gray-400">
          {rowNumber}
        </span>
      </div>

      {/* Guess pegs - 4 large colored pegs */}
      <div className="flex gap-2 sm:gap-3">
        {displayPegs.map((color, index) => (
          <ColorPeg
            key={index}
            color={color}
            size="lg"
            onClick={isCurrentRow ? () => onSlotClick(index) : undefined}
            isSelected={isCurrentRow && selectedSlot === index}
            isClickable={isCurrentRow}
          />
        ))}
      </div>

      {/* Feedback pegs - 2x2 grid of small pegs */}
      <div className="grid grid-cols-2 gap-1 sm:gap-1.5 p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
        {feedbackPegs.map((feedback, index) => renderFeedbackPeg(feedback, index))}
      </div>
    </div>
  );
}
