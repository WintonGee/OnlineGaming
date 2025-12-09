/**
 * Type-safe localStorage utilities with error handling
 * Provides a clean abstraction over localStorage with SSR safety
 */

/**
 * Creates a type-safe storage manager for a specific key
 *
 * @example
 * ```ts
 * const gameStorage = createStorage<SavedGameState>('game-state');
 * const state = gameStorage.load();
 * gameStorage.save({ tiles: [...], moves: 10 });
 * gameStorage.clear();
 * ```
 */
export function createStorage<T>(key: string) {
  /**
   * Load value from localStorage
   * @returns Parsed value or null if not found/invalid
   */
  const load = (): T | null => {
    if (typeof window === "undefined") return null;

    try {
      const saved = localStorage.getItem(key);
      if (!saved) return null;
      return JSON.parse(saved) as T;
    } catch {
      // Invalid JSON or other error - return null
      return null;
    }
  };

  /**
   * Save value to localStorage
   * Silently fails if localStorage is unavailable or full
   */
  const save = (value: T): void => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Silently fail if localStorage is full or unavailable
    }
  };

  /**
   * Remove value from localStorage
   */
  const clear = (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  };

  /**
   * Check if a value exists in localStorage
   */
  const exists = (): boolean => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(key) !== null;
  };

  return { load, save, clear, exists };
}
