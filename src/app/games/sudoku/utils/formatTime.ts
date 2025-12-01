/**
 * Formats time in seconds to a 3-digit format (like classic Minesweeper)
 * Useful for game timers that display elapsed time
 * 
 * @param seconds - Time in seconds
 * @returns Formatted time string (e.g., "000", "042", "999")
 * 
 * @example
 * ```ts
 * formatTime(0) // "000"
 * formatTime(42) // "042"
 * formatTime(999) // "999"
 * formatTime(1000) // "999" (clamped)
 * ```
 */
export function formatTime(seconds: number): string {
  // Classic minesweeper shows just seconds up to 999
  const clamped = Math.min(seconds, 999);
  return clamped.toString().padStart(3, '0');
}

