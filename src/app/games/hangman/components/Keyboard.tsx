"use client";

import { Button } from "@/components/ui/button";
import { ALPHABET } from "../constants";

interface KeyboardProps {
  guessedLetters: string[];
  incorrectGuesses: string[];
  onGuess: (letter: string) => void;
  disabled: boolean;
}

export default function Keyboard({
  guessedLetters,
  incorrectGuesses,
  onGuess,
  disabled,
}: KeyboardProps) {
  const getButtonVariant = (letter: string) => {
    if (incorrectGuesses.includes(letter)) {
      return "destructive";
    }
    if (guessedLetters.includes(letter)) {
      return "default";
    }
    return "outline";
  };

  const isLetterUsed = (letter: string) => {
    return guessedLetters.includes(letter) || incorrectGuesses.includes(letter);
  };

  return (
    <div className="mb-4 sm:mb-6">
      <div className="grid grid-cols-7 sm:grid-cols-9 md:grid-cols-13 gap-2 max-w-4xl mx-auto">
        {ALPHABET.map((letter) => (
          <Button
            key={letter}
            onClick={() => onGuess(letter)}
            disabled={disabled || isLetterUsed(letter)}
            variant={getButtonVariant(letter)}
            className="h-10 sm:h-12 text-sm sm:text-base font-bold"
          >
            {letter}
          </Button>
        ))}
      </div>
    </div>
  );
}
