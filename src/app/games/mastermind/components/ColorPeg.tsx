"use client";

import { PegColor } from "../types";
import { COLOR_CLASSES, COLOR_HOVER_CLASSES } from "../constants";
import { cn } from "@/lib/utils/cn";

interface ColorPegProps {
  color: PegColor | null;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  isSelected?: boolean;
  isClickable?: boolean;
}

const SIZE_CLASSES = {
  sm: "w-6 h-6 sm:w-7 sm:h-7",
  md: "w-8 h-8 sm:w-10 sm:h-10",
  lg: "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14",
};

export default function ColorPeg({
  color,
  size = "md",
  onClick,
  isSelected = false,
  isClickable = false,
}: ColorPegProps) {
  const baseClasses = cn(
    "rounded-full transition-all duration-200",
    SIZE_CLASSES[size],
    // Empty peg styling
    !color && "border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800",
    // Colored peg styling
    color && COLOR_CLASSES[color],
    // Clickable state
    isClickable && "cursor-pointer",
    isClickable && !isSelected && "hover:scale-110",
    isClickable && color && COLOR_HOVER_CLASSES[color],
    !isClickable && "cursor-default",
    // Selected state - ring highlight
    isSelected && "ring-4 ring-blue-400 dark:ring-blue-500 ring-offset-2 dark:ring-offset-gray-900 scale-105",
    // Shadow
    color && "shadow-md",
    // Focus states for accessibility
    isClickable && "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
  );

  if (isClickable && onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={baseClasses}
        aria-label={color ? `${color} peg` : "empty peg slot"}
        aria-pressed={isSelected}
      />
    );
  }

  return (
    <div
      className={baseClasses}
      role={color ? "img" : undefined}
      aria-label={color ? `${color} peg` : undefined}
    />
  );
}
