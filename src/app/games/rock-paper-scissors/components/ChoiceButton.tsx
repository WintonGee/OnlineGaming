"use client";

import { cn } from "@/lib/utils/cn";
import { Choice } from "../types";

interface ChoiceButtonProps {
  choice: Choice;
  onClick: () => void;
  disabled?: boolean;
  selected?: boolean;
  size?: "normal" | "large";
}

// SVG hand icons for each choice
const ChoiceIcon = ({ choice, className }: { choice: Choice; className?: string }) => {
  const baseClass = cn("w-full h-full", className);

  switch (choice) {
    case "rock":
      return (
        <svg viewBox="0 0 100 100" className={baseClass} fill="currentColor">
          {/* Fist/Rock shape */}
          <path d="M30 70 Q25 50 35 35 Q40 25 55 25 Q70 25 75 40 Q80 55 75 70 Q70 85 50 85 Q30 85 30 70 Z" />
          {/* Knuckle details */}
          <circle cx="40" cy="40" r="5" opacity="0.3" />
          <circle cx="55" cy="38" r="5" opacity="0.3" />
          <circle cx="68" cy="45" r="4" opacity="0.3" />
        </svg>
      );
    case "paper":
      return (
        <svg viewBox="0 0 100 100" className={baseClass} fill="currentColor">
          {/* Open palm */}
          <path d="M25 85 L25 50 Q25 40 30 35 L30 20 Q30 15 35 15 Q40 15 40 20 L40 35" />
          <path d="M40 35 L40 15 Q40 10 45 10 Q50 10 50 15 L50 35" />
          <path d="M50 35 L50 12 Q50 7 55 7 Q60 7 60 12 L60 35" />
          <path d="M60 35 L60 15 Q60 10 65 10 Q70 10 70 15 L70 40" />
          <path d="M70 40 L72 30 Q73 25 78 27 Q82 29 80 35 L75 50" />
          <path d="M25 50 Q20 65 25 80 Q30 90 50 90 Q70 90 75 80 Q80 70 75 50 L25 50 Z" />
        </svg>
      );
    case "scissors":
      return (
        <svg viewBox="0 0 100 100" className={baseClass} fill="currentColor">
          {/* Peace sign / scissors fingers */}
          <path d="M35 90 Q30 85 32 75 L32 50 Q32 45 37 45 Q42 45 42 50 L42 55" />
          <path d="M42 55 L38 20 Q37 12 45 10 Q52 8 53 16 L55 45" />
          <path d="M55 45 L58 15 Q59 7 67 8 Q74 9 73 17 L68 50" />
          <path d="M68 50 Q72 55 70 65 Q68 75 60 80 Q55 85 50 85 L42 85 Q38 85 35 90" />
          {/* Closed fingers */}
          <ellipse cx="55" cy="70" rx="12" ry="10" opacity="0.5" />
        </svg>
      );
  }
};

const CHOICE_LABELS: Record<Choice, string> = {
  rock: "Rock",
  paper: "Paper",
  scissors: "Scissors",
};

export default function ChoiceButton({
  choice,
  onClick,
  disabled = false,
  selected = false,
  size = "normal",
}: ChoiceButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative flex flex-col items-center justify-center gap-1 sm:gap-2 rounded-xl sm:rounded-2xl border-2 transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-black",
        size === "normal" ? "w-[88px] h-[100px] sm:w-28 sm:h-32" : "w-16 h-20",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:scale-105 active:scale-95 cursor-pointer",
        selected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
      )}
      aria-label={`Choose ${CHOICE_LABELS[choice]}`}
    >
      <div className={cn(size === "normal" ? "w-10 h-10 sm:w-14 sm:h-14" : "w-8 h-8")}>
        <ChoiceIcon choice={choice} />
      </div>
      <span
        className={cn(
          "font-semibold",
          size === "normal" ? "text-xs sm:text-base" : "text-xs"
        )}
      >
        {CHOICE_LABELS[choice]}
      </span>
    </button>
  );
}

// Export the icon component for use in other places
export { ChoiceIcon };
