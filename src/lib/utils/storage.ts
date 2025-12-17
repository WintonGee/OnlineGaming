/**
 * Type-safe storage utilities with error handling
 * Provides a clean abstraction over localStorage and sessionStorage with SSR safety
 */

/**
 * Creates a type-safe localStorage manager for a specific key
 *
 * @example
 * ```ts
 * const gameStorage = createStorage<SavedGameState>('game-state');
 * const state = gameStorage.load();
 * gameStorage.save({ score: 100, tiles: [...] });
 * gameStorage.clear();
 * if (gameStorage.exists()) { ... }
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

/**
 * Creates a type-safe sessionStorage manager for a specific key
 * SessionStorage persists only for the current browser session (cleared on tab close)
 *
 * @example
 * ```ts
 * const sessionState = createSessionStorage<TempState>('temp-state');
 * sessionState.save({ inProgress: true });
 * const state = sessionState.load();
 * ```
 */
export function createSessionStorage<T>(key: string) {
  const load = (): T | null => {
    if (typeof window === "undefined") return null;

    try {
      const saved = sessionStorage.getItem(key);
      if (!saved) return null;
      return JSON.parse(saved) as T;
    } catch {
      return null;
    }
  };

  const save = (value: T): void => {
    if (typeof window === "undefined") return;

    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Silently fail if sessionStorage is full
    }
  };

  const clear = (): void => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(key);
  };

  const exists = (): boolean => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(key) !== null;
  };

  return { load, save, clear, exists };
}

/**
 * Simple localStorage get/set helpers for one-off usage
 *
 * @example
 * ```ts
 * storage.set('key', { value: 1 });
 * const value = storage.get<{ value: number }>('key');
 * storage.remove('key');
 * ```
 */
export const storage = {
  /**
   * Get and parse a value from localStorage
   */
  get: <T>(key: string, defaultValue?: T): T | null => {
    if (typeof window === "undefined") return defaultValue ?? null;

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
    if (typeof window === "undefined") return;

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
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  },

  /**
   * Clear all localStorage
   */
  clear: (): void => {
    if (typeof window === "undefined") return;
    localStorage.clear();
  },
};
