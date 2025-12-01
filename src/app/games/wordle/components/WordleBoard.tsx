"use client";

import { Guess } from "../types";
import { WORD_LENGTH, MAX_GUESSES } from "../constants";
import { cn } from "@/lib/utils/cn";

interface WordleBoardProps {
  guesses: Guess[];
  currentGuess: string;
  shake: boolean;
}

export default function WordleBoard({
  guesses,
  currentGuess,
  shake,
}: WordleBoardProps) {
  const currentAttempt = guesses.length;

  const getTileClassName = (
    status?: "correct" | "present" | "absent" | "unused",
    isEmpty = false,
    isCurrentRow = false
  ): string => {
    const baseClasses =
      "w-12 h-12 sm:w-14 sm:h-14 border-2 flex items-center justify-center font-bold text-xl sm:text-2xl transition-all duration-300";

    if (isEmpty && !isCurrentRow) {
      return cn(
        baseClasses,
        "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
      );
    }

    if (isCurrentRow && !isEmpty) {
      return cn(
        baseClasses,
        "border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 scale-105"
      );
    }

    if (isEmpty && isCurrentRow) {
      return cn(
        baseClasses,
        "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
      );
    }

    const statusClasses = {
      correct: "bg-green-500 dark:bg-green-600 border-green-500 dark:border-green-600 text-white",
      present: "bg-yellow-500 dark:bg-yellow-600 border-yellow-500 dark:border-yellow-600 text-white",
      absent: "bg-gray-400 dark:bg-gray-700 border-gray-400 dark:border-gray-700 text-white",
      unused: "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800",
    };

    return cn(
      baseClasses,
      status ? statusClasses[status] : statusClasses.unused
    );
  };

  const renderRow = (rowIndex: number) => {
    const isCurrentRow = rowIndex === currentAttempt;
    const guess = guesses[rowIndex];

    if (guess) {
      // Completed guess row
      return guess.letters.map((letter, colIndex) => (
        <div
          key={colIndex}
          className={getTileClassName(letter.status)}
          style={{
            animationDelay: `${colIndex * 100}ms`,
          }}
        >
          {letter.char}
        </div>
      ));
    }

    if (isCurrentRow) {
      // Current guess row
      return Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
        const letter = currentGuess[colIndex] || "";
        const isEmpty = letter === "";

        return (
          <div
            key={colIndex}
            className={getTileClassName(undefined, isEmpty, true)}
          >
            {letter}
          </div>
        );
      });
    }

    // Empty future row
    return Array.from({ length: WORD_LENGTH }).map((_, colIndex) => (
      <div key={colIndex} className={getTileClassName(undefined, true, false)}>
        {""}
      </div>
    ));
  };

  return (
    <div className="flex flex-col items-center justify-center pt-4 sm:pt-6 pb-2 sm:pb-2">
      <div className="space-y-2">
        {Array.from({ length: MAX_GUESSES }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className={cn(
              "flex gap-2",
              shake && rowIndex === currentAttempt && "animate-shake"
            )}
          >
            {renderRow(rowIndex)}
          </div>
        ))}
      </div>
    </div>
  );
}
