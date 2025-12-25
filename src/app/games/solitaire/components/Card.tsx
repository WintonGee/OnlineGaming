"use client";

import { Card as CardType } from "../types";
import { cn } from "@/lib/utils/cn";

interface CardProps {
  card: CardType;
  isSelected?: boolean;
  isPlayable?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

const SUIT_SYMBOLS: Record<CardType["suit"], string> = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};

export default function Card({
  card,
  isSelected = false,
  isPlayable = true,
  onClick,
  onDoubleClick,
  style,
  className,
}: CardProps) {
  const { suit, rank, faceUp } = card;
  const isRed = suit === "hearts" || suit === "diamonds";

  // Face-down card
  if (!faceUp) {
    return (
      <div
        className={cn(
          "card w-[70px] h-[100px] rounded-lg",
          "bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900",
          "border-2 border-blue-400 dark:border-blue-500",
          "shadow-md flex items-center justify-center",
          "select-none",
          className
        )}
        style={style}
      >
        <div className="w-[50px] h-[80px] rounded border-2 border-blue-400/50 dark:border-blue-500/50" />
      </div>
    );
  }

  const textColor = isRed
    ? "text-red-600 dark:text-red-500"
    : "text-gray-900 dark:text-gray-100";

  // Face-up card
  return (
    <div
      className={cn(
        "card relative w-[70px] h-[100px] rounded-lg",
        "bg-white dark:bg-gray-900",
        "border-2",
        isSelected
          ? "border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/50 dark:ring-blue-400/50"
          : "border-gray-300 dark:border-gray-600",
        "shadow-md overflow-hidden",
        "select-none",
        isPlayable && "cursor-pointer hover:shadow-lg transition-shadow",
        !isPlayable && "cursor-default",
        className
      )}
      style={style}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {/* Top-left corner */}
      <div className={cn("absolute top-1 left-1.5 text-xs font-bold leading-tight", textColor)}>
        <div className="text-center">{rank}</div>
        <div className="-mt-0.5 text-center">{SUIT_SYMBOLS[suit]}</div>
      </div>

      {/* Center suit - large */}
      <div className={cn("w-full h-full flex items-center justify-center text-3xl", textColor)}>
        {SUIT_SYMBOLS[suit]}
      </div>

      {/* Bottom-right corner (upside down) */}
      <div className={cn("absolute bottom-1 right-1.5 text-xs font-bold leading-tight rotate-180", textColor)}>
        <div className="text-center">{rank}</div>
        <div className="-mt-0.5 text-center">{SUIT_SYMBOLS[suit]}</div>
      </div>
    </div>
  );
}

// Empty card slot placeholder
export function CardPlaceholder({
  onClick,
  className,
  children,
}: {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "w-[70px] h-[100px] rounded-lg",
        "border-2 border-dashed border-gray-300 dark:border-gray-600",
        "bg-gray-100/50 dark:bg-gray-800/50",
        "flex items-center justify-center",
        onClick && "cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
