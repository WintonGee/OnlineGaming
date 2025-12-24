"use client";

import { PegColor } from "../types";
import { COLOR_CLASSES } from "../constants";
import { cn } from "@/lib/utils/cn";

interface ColorPegProps {
  color: PegColor | null;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  isSelected?: boolean;
  isClickable?: boolean;
}

const SIZE_CLASSES = {
  sm: "w-6 h-6",
  md: "w-9 h-9",
  lg: "w-11 h-11",
};

export default function ColorPeg({
  color,
  size = "md",
  onClick,
  isSelected = false,
  isClickable = false,
}: ColorPegProps) {
  const baseClasses = cn(
    "rounded-full transition-all duration-150",
    SIZE_CLASSES[size],
    // Empty peg styling
    !color && "border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900",
    // Colored peg styling
    color && COLOR_CLASSES[color],
    color && "shadow-sm",
    // Clickable state
    isClickable && "cursor-pointer",
    isClickable && !isSelected && "hover:scale-105 active:scale-95",
    !isClickable && "cursor-default",
    // Selected state
    isSelected && "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900 scale-105",
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
