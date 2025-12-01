/**
 * Shared array manipulation utilities
 * Used across multiple games for common array operations
 */

/**
 * Shuffle an array in place using the Fisher-Yates algorithm
 * 
 * @param array - The array to shuffle
 * @returns The shuffled array (same reference, modified in place)
 * 
 * @example
 * ```ts
 * const numbers = [1, 2, 3, 4, 5];
 * shuffleArray(numbers);
 * // numbers is now shuffled
 * ```
 */
export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Get a random item from an array
 * 
 * @param array - The array to select from
 * @returns A random item from the array, or null if array is empty
 * 
 * @example
 * ```ts
 * const items = ['a', 'b', 'c'];
 * const random = getRandomItem(items); // 'a', 'b', or 'c'
 * ```
 */
export function getRandomItem<T>(array: T[]): T | null {
  if (array.length === 0) {
    return null;
  }
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate a unique key for a cell position
 * Useful for React keys, Set/Map lookups, and position tracking
 * 
 * @param row - The row index
 * @param col - The column index
 * @param separator - The separator to use (default: ',')
 * @returns A unique string key for the position
 * 
 * @example
 * ```ts
 * getPositionKey(3, 5) // "3,5"
 * getPositionKey(3, 5, '-') // "3-5"
 * ```
 */
export function getPositionKey(
  row: number,
  col: number,
  separator: string = ','
): string {
  return `${row}${separator}${col}`;
}

