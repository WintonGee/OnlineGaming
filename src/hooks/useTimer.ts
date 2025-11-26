"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Timer hook for games
 * Provides a simple elapsed time counter in seconds
 *
 * @returns Object with time state and control functions
 *
 * @example
 * ```tsx
 * const timer = useTimer();
 *
 * // Start timer on first move
 * if (firstMove) {
 *   timer.start();
 * }
 *
 * // Stop timer when game ends
 * if (gameOver) {
 *   timer.stop();
 * }
 *
 * // Display: {timer.time} seconds
 * ```
 */
export function useTimer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    setTime(0);
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  return { time, start, stop, reset, isRunning };
}
