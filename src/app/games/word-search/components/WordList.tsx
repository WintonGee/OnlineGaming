"use client";

import { PlacedWord } from "../types";

interface WordListProps {
  words: PlacedWord[];
  foundWords: string[];
}

export default function WordList({ words, foundWords }: WordListProps) {
  return (
    <div className="mt-4 sm:mt-6">
      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 text-center">
        Find these words ({foundWords.length}/{words.length})
      </h3>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {words.map((placedWord, index) => {
          const isFound = foundWords.includes(placedWord.word);
          return (
            <span
              key={index}
              className={`
                px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium
                transition-all duration-300
                ${
                  isFound
                    ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 line-through"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                }
              `}
            >
              {placedWord.word}
            </span>
          );
        })}
      </div>
    </div>
  );
}
