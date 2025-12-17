"use client";

import { useCallback, useRef, useState } from "react";
import { useDialogState } from "@/lib/hooks/useDialogState";

/**
 * Core hook for AI game functionality
 * Provides common AI game state management: thinking state, timeout handling, and instructions dialog
 *
 * @example
 * ```ts
 * const { isAIThinking, setIsAIThinking, aiTimeoutRef, clearAITimeout, instructionsDialog } = useAIGameCore();
 *
 * // In AI move effect
 * clearAITimeout();
 * setIsAIThinking(true);
 * aiTimeoutRef.current = setTimeout(() => { ... }, AI_DELAY);
 *
 * // In handlers
 * const handleNewGame = useCallback(() => {
 *   clearAITimeout();
 *   resetBoard();
 * }, [clearAITimeout, resetBoard]);
 * ```
 */
export function useAIGameCore() {
  const [isAIThinking, setIsAIThinking] = useState(false);
  const aiTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const instructionsDialog = useDialogState();

  /**
   * Clear any pending AI timeout and reset thinking state
   */
  const clearAITimeout = useCallback(() => {
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
      aiTimeoutRef.current = null;
    }
    setIsAIThinking(false);
  }, []);

  /**
   * Create a handler that clears AI timeout before executing an action
   * Useful for mode changes, difficulty changes, new game, etc.
   */
  const createClearingHandler = useCallback(
    <T extends unknown[]>(action: (...args: T) => void) => {
      return (...args: T) => {
        clearAITimeout();
        action(...args);
      };
    },
    [clearAITimeout]
  );

  return {
    isAIThinking,
    setIsAIThinking,
    aiTimeoutRef,
    clearAITimeout,
    createClearingHandler,
    instructionsDialog,
  };
}
