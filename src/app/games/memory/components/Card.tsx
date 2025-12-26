"use client";

import { Card as CardType } from "../types";
import { cn } from "@/lib/utils/cn";

type CardSize = "normal" | "small" | "tiny" | "micro";

interface CardProps {
  card: CardType;
  size?: CardSize;
  onClick: () => void;
  disabled: boolean;
}

// Size-specific styling
const sizeConfig: Record<CardSize, {
  questionMark: string;
  symbol: string;
  symbolMatched: string;
  borderRadius: string;
  border: string;
}> = {
  normal: {
    questionMark: "text-4xl",
    symbol: "text-4xl sm:text-5xl",
    symbolMatched: "scale-110",
    borderRadius: "rounded-xl",
    border: "border-2",
  },
  small: {
    questionMark: "text-2xl",
    symbol: "text-2xl sm:text-3xl",
    symbolMatched: "scale-105",
    borderRadius: "rounded-lg",
    border: "border-2",
  },
  tiny: {
    questionMark: "text-lg",
    symbol: "text-lg sm:text-xl",
    symbolMatched: "scale-105",
    borderRadius: "rounded-md",
    border: "border",
  },
  micro: {
    questionMark: "text-sm",
    symbol: "text-sm sm:text-base",
    symbolMatched: "",
    borderRadius: "rounded",
    border: "border",
  },
};

export default function Card({ card, size = "normal", onClick, disabled }: CardProps) {
  const isFlipped = card.status === "flipped" || card.status === "matched";
  const isMatched = card.status === "matched";
  const config = sizeConfig[size];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isFlipped}
      className={cn(
        "memory-card aspect-square w-full cursor-pointer",
        config.borderRadius,
        "transition-transform duration-200",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
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
            "memory-card-face memory-card-back absolute inset-0",
            config.borderRadius,
            "flex items-center justify-center",
            "bg-gradient-to-br from-blue-500 to-blue-600",
            "dark:from-blue-600 dark:to-blue-700",
            config.border,
            "border-blue-400 dark:border-blue-500",
            "shadow-md hover:shadow-lg",
            !disabled && !isFlipped && "hover:scale-105"
          )}
        >
          <span className={cn(config.questionMark, "text-white/30 select-none")}>?</span>
        </div>

        {/* Card Front (revealed state) */}
        <div
          className={cn(
            "memory-card-face memory-card-front absolute inset-0",
            config.borderRadius,
            "flex items-center justify-center",
            "bg-white dark:bg-gray-800",
            config.border,
            isMatched
              ? "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/30"
              : "border-gray-200 dark:border-gray-600",
            "shadow-md"
          )}
        >
          <span
            className={cn(
              config.symbol,
              "select-none transition-transform duration-200",
              isMatched && config.symbolMatched
            )}
          >
            {card.symbol}
          </span>
        </div>
      </div>
    </button>
  );
}
