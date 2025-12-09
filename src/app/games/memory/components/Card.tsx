"use client";

import { Card as CardType } from "../types";
import { cn } from "@/lib/utils/cn";

interface CardProps {
  card: CardType;
  onClick: () => void;
  disabled: boolean;
}

export default function Card({ card, onClick, disabled }: CardProps) {
  const isFlipped = card.status === "flipped" || card.status === "matched";
  const isMatched = card.status === "matched";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isFlipped}
      className={cn(
        "memory-card aspect-square w-full rounded-xl cursor-pointer",
        "transition-transform duration-200",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "dark:focus:ring-offset-black",
        disabled && "cursor-not-allowed"
      )}
      aria-label={
        isFlipped ? `Card showing ${card.symbol}` : "Hidden card, click to flip"
      }
    >
      <div
        className={cn(
          "memory-card-inner relative w-full h-full transition-transform duration-300",
          "preserve-3d",
          isFlipped && "flipped"
        )}
      >
        {/* Card Back (hidden state) */}
        <div
          className={cn(
            "memory-card-face memory-card-back absolute inset-0 rounded-xl",
            "flex items-center justify-center",
            "bg-gradient-to-br from-blue-500 to-blue-600",
            "dark:from-blue-600 dark:to-blue-700",
            "border-2 border-blue-400 dark:border-blue-500",
            "shadow-md hover:shadow-lg",
            !disabled && !isFlipped && "hover:scale-105"
          )}
        >
          <span className="text-4xl text-white/30 select-none">?</span>
        </div>

        {/* Card Front (revealed state) */}
        <div
          className={cn(
            "memory-card-face memory-card-front absolute inset-0 rounded-xl",
            "flex items-center justify-center",
            "bg-white dark:bg-gray-800",
            "border-2",
            isMatched
              ? "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/30"
              : "border-gray-200 dark:border-gray-600",
            "shadow-md"
          )}
        >
          <span
            className={cn(
              "text-4xl sm:text-5xl select-none transition-transform duration-200",
              isMatched && "scale-110"
            )}
          >
            {card.symbol}
          </span>
        </div>
      </div>
    </button>
  );
}
