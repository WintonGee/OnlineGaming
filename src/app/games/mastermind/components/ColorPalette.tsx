"use client";

import { PegColor } from "../types";
import { COLORS, COLOR_CLASSES } from "../constants";
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
    <div className="flex justify-center gap-2">
      {COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onColorSelect(color)}
          disabled={disabled}
          className={cn(
            "w-10 h-10 rounded-full transition-all duration-150",
            COLOR_CLASSES[color],
            "shadow-sm",
            !disabled && "cursor-pointer hover:scale-110 active:scale-95",
            !disabled && "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
            disabled && "opacity-40 cursor-not-allowed"
          )}
          aria-label={`Select ${color}`}
          aria-disabled={disabled}
        />
      ))}
    </div>
  );
}
