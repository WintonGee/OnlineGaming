"use client";

import { DragEvent } from "react";
import { Card as CardType } from "../types";
import { cn } from "@/lib/utils/cn";

interface CardProps {
  card: CardType;
  isSelected?: boolean;
  isPlayable?: boolean;
  isDragging?: boolean;
  isDragOver?: boolean;
  draggable?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onDragStart?: (e: DragEvent) => void;
  onDragEnd?: () => void;
  onDragOver?: (e: DragEvent) => void;
  onDragLeave?: () => void;
  onDrop?: (e: DragEvent) => void;
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
  isDragging = false,
  isDragOver = false,
  draggable = false,
  onClick,
  onDoubleClick,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
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
          : isDragOver
          ? "border-green-500 dark:border-green-400 ring-2 ring-green-500/50"
          : "border-gray-300 dark:border-gray-600",
        "shadow-md overflow-hidden",
        "select-none",
        isPlayable && "cursor-grab hover:shadow-lg transition-shadow",
        isDragging && "opacity-50 cursor-grabbing",
        !isPlayable && "cursor-default",
        className
      )}
      style={style}
      draggable={draggable && isPlayable}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
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
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
}: {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  isDragOver?: boolean;
  onDragOver?: (e: DragEvent) => void;
  onDragLeave?: () => void;
  onDrop?: (e: DragEvent) => void;
}) {
  return (
    <div
      className={cn(
        "w-[70px] h-[100px] rounded-lg flex-shrink-0",
        "border-2 border-dashed",
        isDragOver
          ? "border-green-500 dark:border-green-400 bg-green-100/50 dark:bg-green-900/30"
          : "border-gray-300 dark:border-gray-600 bg-gray-100/50 dark:bg-gray-800/50",
        "flex items-center justify-center",
        "transition-colors",
        onClick && "cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50",
        className
      )}
      onClick={onClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {children}
    </div>
  );
}
