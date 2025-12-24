"use client";

import { PegColor } from "../types";
import { COLORS, COLOR_CLASSES, COLOR_HOVER_CLASSES } from "../constants";
import { cn } from "@/lib/utils/cn";

interface ColorPaletteProps {
  onColorSelect: (color: PegColor) => void;
  disabled: boolean;
}

export default function ColorPalette({
  onColorSelect,
  disabled,
}: ColorPaletteProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 p-4">
      {COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onColorSelect(color)}
          disabled={disabled}
          className={cn(
            "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full transition-all duration-200",
            COLOR_CLASSES[color],
            "shadow-md",
            // Interactive states when enabled
            !disabled && "cursor-pointer hover:scale-110",
            !disabled && COLOR_HOVER_CLASSES[color],
            !disabled &&
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
            // Disabled state
            disabled && "opacity-50 cursor-not-allowed"
          )}
          aria-label={`Select ${color} color`}
          aria-disabled={disabled}
        />
      ))}
    </div>
  );
}
