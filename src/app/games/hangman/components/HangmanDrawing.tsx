"use client";

interface HangmanDrawingProps {
  incorrectGuessCount: number;
}

export default function HangmanDrawing({ incorrectGuessCount }: HangmanDrawingProps) {
  return (
    <div className="flex justify-center mb-8">
      <svg
        width="200"
        height="250"
        className="stroke-black dark:stroke-white"
        strokeWidth="3"
        strokeLinecap="round"
      >
        {/* Base */}
        <line x1="20" y1="230" x2="180" y2="230" />
        {/* Pole */}
        <line x1="50" y1="230" x2="50" y2="20" />
        {/* Top beam */}
        <line x1="50" y1="20" x2="130" y2="20" />
        {/* Rope */}
        <line x1="130" y1="20" x2="130" y2="50" />

        {/* Head */}
        {incorrectGuessCount >= 1 && (
          <circle cx="130" cy="70" r="20" fill="none" />
        )}

        {/* Body */}
        {incorrectGuessCount >= 2 && (
          <line x1="130" y1="90" x2="130" y2="140" />
        )}

        {/* Left arm */}
        {incorrectGuessCount >= 3 && (
          <line x1="130" y1="100" x2="100" y2="120" />
        )}

        {/* Right arm */}
        {incorrectGuessCount >= 4 && (
          <line x1="130" y1="100" x2="160" y2="120" />
        )}

        {/* Left leg */}
        {incorrectGuessCount >= 5 && (
          <line x1="130" y1="140" x2="110" y2="180" />
        )}

        {/* Right leg */}
        {incorrectGuessCount >= 6 && (
          <line x1="130" y1="140" x2="150" y2="180" />
        )}
      </svg>
    </div>
  );
}
