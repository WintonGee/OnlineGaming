/**
 * Shared difficulty constants used across multiple games
 */

import { Difficulty } from "@/lib/types/shared";

/**
 * Standard difficulty labels for display
 * Used by games with standard easy/medium/hard difficulty
 */
export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
} as const;

/**
 * Default difficulty level
 */
export const DEFAULT_DIFFICULTY: Difficulty = "medium";
