"use client";

import { cn } from "@/lib/utils/cn";
import { WordState } from "../types";
import { CARET_BLINK_DURATION } from "../constants";
import { useEffect, useState } from "react";

interface WordDisplayProps {
  words: WordState[];
  currentWordIndex: number;
  currentCharIndex: number;
  isActive: boolean;
}

export default function WordDisplay({
  words,
  currentWordIndex,
  currentCharIndex,
  isActive,
}: WordDisplayProps) {
  const [caretVisible, setCaretVisible] = useState(true);

  // Blinking caret effect
  useEffect(() => {
    if (!isActive) {
      setCaretVisible(true);
      return;
    }

    const interval = setInterval(() => {
      setCaretVisible((prev) => !prev);
    }, CARET_BLINK_DURATION);

    return () => clearInterval(interval);
  }, [isActive]);

  // Reset caret visibility when typing (always show on keystroke)
  useEffect(() => {
    setCaretVisible(true);
  }, [currentWordIndex, currentCharIndex]);

  return (
    <div className="relative font-mono text-xl sm:text-2xl leading-relaxed">
      <div className="flex flex-wrap gap-x-3 gap-y-2">
        {words.map((wordState, wordIndex) => {
          const isCurrentWord = wordIndex === currentWordIndex;
          const isCompletedWord = wordIndex < currentWordIndex;

          return (
            <div
              key={wordIndex}
              className={cn(
                "relative inline-flex",
                isCompletedWord && "opacity-60"
              )}
            >
              {/* Render each character */}
              {wordState.characters.map((charState, charIndex) => {
                const isCurrentChar =
                  isCurrentWord && charIndex === currentCharIndex;

                return (
                  <span key={charIndex} className="relative">
                    {/* Caret before current character */}
                    {isCurrentChar && isActive && (
                      <span
                        className={cn(
                          "absolute left-0 top-0 w-0.5 h-full bg-black dark:bg-white transition-opacity",
                          caretVisible ? "opacity-100" : "opacity-0"
                        )}
                        style={{ transform: "translateX(-1px)" }}
                      />
                    )}
                    <span
                      className={cn(
                        // Base styles
                        "transition-colors duration-75",
                        // Status-based colors
                        charState.status === "correct" &&
                          "text-green-500 dark:text-green-400",
                        charState.status === "incorrect" &&
                          "text-red-500 dark:text-red-400",
                        charState.status === "extra" &&
                          "text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30",
                        charState.status === "pending" &&
                          "text-gray-400 dark:text-gray-600",
                        // Highlight current word
                        isCurrentWord &&
                          charState.status === "pending" &&
                          "text-gray-600 dark:text-gray-400"
                      )}
                    >
                      {charState.status === "extra"
                        ? charState.typed
                        : charState.char}
                    </span>
                  </span>
                );
              })}

              {/* Caret at end of current word (after all characters) */}
              {isCurrentWord &&
                currentCharIndex >= wordState.characters.length &&
                isActive && (
                  <span
                    className={cn(
                      "relative w-0.5 h-full bg-black dark:bg-white transition-opacity",
                      caretVisible ? "opacity-100" : "opacity-0"
                    )}
                    style={{ minHeight: "1.5em" }}
                  />
                )}
            </div>
          );
        })}
      </div>

      {/* Instructions overlay when not active */}
      {!isActive && currentWordIndex === 0 && currentCharIndex === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 text-center px-4">
            Click here or start typing to begin
          </p>
        </div>
      )}
    </div>
  );
}
