/**
 * Shared time formatting utilities for games
 */

/**
 * Formats time in seconds to a 3-digit format (like classic Minesweeper)
 * Useful for game timers that display elapsed time in a compact format
 *
 * @param seconds - Time in seconds
 * @returns Formatted time string (e.g., "000", "042", "999")
 *
 * @example
 * ```ts
 * formatTimeClassic(0) // "000"
 * formatTimeClassic(42) // "042"
 * formatTimeClassic(999) // "999"
 * formatTimeClassic(1000) // "999" (clamped)
 * ```
 */
export function formatTimeClassic(seconds: number): string {
  const clamped = Math.min(seconds, 999);
  return clamped.toString().padStart(3, "0");
}

/**
 * Formats time in seconds to MM:SS format
 * Useful for displaying game duration in a human-readable format
 *
 * @param seconds - Time in seconds
 * @returns Formatted time string (e.g., "00:00", "02:45", "59:59")
 *
 * @example
 * ```ts
 * formatTimeMMSS(0) // "00:00"
 * formatTimeMMSS(65) // "01:05"
 * formatTimeMMSS(3599) // "59:59"
 * ```
 */
export function formatTimeMMSS(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Formats time in seconds to M:SS format (no leading zero on minutes)
 * Useful for displaying shorter durations
 *
 * @param seconds - Time in seconds
 * @returns Formatted time string (e.g., "0:00", "2:45", "59:59")
 *
 * @example
 * ```ts
 * formatTimeMSS(0) // "0:00"
 * formatTimeMSS(65) // "1:05"
 * formatTimeMSS(125) // "2:05"
 * ```
 */
export function formatTimeMSS(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
