/**
 * Type-safe localStorage utilities for Snake game
 */

/**
 * Creates a type-safe storage manager for a specific key
 */
export function createStorage<T>(key: string) {
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

  const save = (value: T): void => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Silently fail
    }
  };

  const clear = (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  };

  return { load, save, clear };
}

/**
 * Simple localStorage helpers
 */
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    if (typeof window === "undefined") return defaultValue ?? null;

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : (defaultValue ?? null);
    } catch {
      return defaultValue ?? null;
    }
  },

  set: <T>(key: string, value: T): void => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Silently fail
    }
  },

  remove: (key: string): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  },
};
