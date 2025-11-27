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
 * gameStorage.save({ score: 100, tiles: [...] });
 * gameStorage.clear();
 * ```
 */
export function createStorage<T>(key: string) {
  /**
   * Load value from localStorage
   * @returns Parsed value or null if not found/invalid
   */
  const load = (): T | null => {
    if (typeof window === 'undefined') return null;

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
    if (typeof window === 'undefined') return;

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
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  };

  /**
   * Check if a value exists in localStorage
   */
  const exists = (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(key) !== null;
  };

  return { load, save, clear, exists };
}

/**
 * Simple localStorage get/set helpers for one-off usage
 */
export const storage = {
  /**
   * Get and parse a value from localStorage
   */
  get: <T>(key: string, defaultValue?: T): T | null => {
    if (typeof window === 'undefined') return defaultValue ?? null;

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : (defaultValue ?? null);
    } catch {
      return defaultValue ?? null;
    }
  },

  /**
   * Save a value to localStorage
   */
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Silently fail
    }
  },

  /**
   * Remove a value from localStorage
   */
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },

  /**
   * Clear all localStorage
   */
  clear: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  },
};

