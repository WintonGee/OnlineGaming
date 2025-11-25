// Tile styling utilities for 2048

/**
 * Color map for tile text colors
 * Lighter tiles (2, 4) use dark text, others use white
 */
const TEXT_COLOR_MAP: Record<number, string> = {
  2: "text-[#776e65]",
  4: "text-[#776e65]",
  8: "text-white",
  16: "text-white",
  32: "text-white",
  64: "text-white",
  128: "text-white",
  256: "text-white",
  512: "text-white",
  1024: "text-white",
  2048: "text-white",
  4096: "text-white",
  8192: "text-white",
};

/**
 * Color map for tile background colors
 * Uses the classic 2048 game palette
 */
const BACKGROUND_COLOR_MAP: Record<number, string> = {
  2: "#eee4da",
  4: "#ede0c8",
  8: "#f2b179",
  16: "#f59563",
  32: "#f67c5f",
  64: "#f65e3b",
  128: "#edcf72",
  256: "#edcc61",
  512: "#edc850",
  1024: "#edc53f",
  2048: "#edc22e",
  4096: "#3c3a32",
  8192: "#3c3a32",
};

/**
 * Gets the text color class for a tile based on its value
 */
export function getTileTextColor(value: number): string {
  return TEXT_COLOR_MAP[value] || "text-white";
}

/**
 * Gets the background color for a tile based on its value
 */
export function getTileBackground(value: number): string {
  return BACKGROUND_COLOR_MAP[value] || "#3c3a32";
}

/**
 * Gets the font size class based on the number of digits
 */
export function getTileFontSize(value: number): string {
  if (value >= 1000) return "text-xl sm:text-2xl md:text-3xl";
  if (value >= 100) return "text-2xl sm:text-3xl md:text-4xl";
  return "text-3xl sm:text-4xl md:text-5xl";
}

