/**
 * Creates a type-safe storage manager for a specific key
 */
export function createStorage<T>(key: string) {
  const load = (): T | null => {
    if (typeof window === "undefined") return null;
    try {
      const saved = localStorage.getItem(key);
      return saved ? (JSON.parse(saved) as T) : null;
    } catch {
      return null;
    }
  };

  const save = (value: T): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Silently fail if localStorage is full
    }
  };

  const clear = (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  };

  const exists = (): boolean => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(key) !== null;
  };

  return { load, save, clear, exists };
}
