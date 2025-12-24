import { PegColor } from "./types";

// Game constants
export const CODE_LENGTH = 4;
export const MAX_ATTEMPTS = 10;

// Available colors
export const COLORS: PegColor[] = [
  "red",
  "blue",
  "green",
  "yellow",
  "orange",
  "purple",
];

// Color display mapping
export const COLOR_CLASSES: Record<PegColor, string> = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  yellow: "bg-yellow-400",
  orange: "bg-orange-500",
  purple: "bg-purple-500",
};

export const COLOR_HOVER_CLASSES: Record<PegColor, string> = {
  red: "hover:bg-red-600",
  blue: "hover:bg-blue-600",
  green: "hover:bg-green-600",
  yellow: "hover:bg-yellow-500",
  orange: "hover:bg-orange-600",
  purple: "hover:bg-purple-600",
};

// Storage key
export const GAME_STATE_KEY = "mastermind-game-state";
