"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTypingTestGameState } from "./useTypingTestGameState";
import { useDialogState } from "@/lib/hooks/useDialogState";
import { isValidTypingCharacter } from "../logic/validation";

export function useGameLogic() {
  const gameState = useTypingTestGameState();
  const instructionsDialog = useDialogState();
  const resultsDialog = useDialogState();
  const inputRef = useRef<HTMLInputElement>(null);
  const hasShownResults = useRef(false);

  // Show results dialog when test completes
  useEffect(() => {
    if (gameState.gameState.isComplete && !hasShownResults.current) {
      hasShownResults.current = true;
      resultsDialog.open();
    }
  }, [gameState.gameState.isComplete, resultsDialog]);

  // Reset results shown flag when starting new test
  useEffect(() => {
    if (!gameState.gameState.isComplete && hasShownResults.current) {
      hasShownResults.current = false;
    }
  }, [gameState.gameState.isComplete]);

  // Handle keyboard input for typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keyboard if a dialog is open
      if (instructionsDialog.isOpen || resultsDialog.isOpen) {
        return;
      }

      // Tab to restart test
      if (e.key === "Tab") {
        e.preventDefault();
        handleNewTest();
        return;
      }

      // Don't process other keys if test is complete
      if (gameState.gameState.isComplete) {
        return;
      }

      // Handle backspace
      if (e.key === "Backspace") {
        e.preventDefault();
        gameState.handleBackspace();
        return;
      }

      // Handle space
      if (e.key === " ") {
        e.preventDefault();
        gameState.handleCharacterInput(" ");
        return;
      }

      // Handle regular characters
      if (e.key.length === 1 && isValidTypingCharacter(e.key)) {
        e.preventDefault();
        gameState.handleCharacterInput(e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    gameState,
    instructionsDialog.isOpen,
    resultsDialog.isOpen,
  ]);

  // Focus management - keep focus on the game area
  useEffect(() => {
    const handleClick = () => {
      // Refocus on click if no dialog is open
      if (!instructionsDialog.isOpen && !resultsDialog.isOpen) {
        inputRef.current?.focus();
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [instructionsDialog.isOpen, resultsDialog.isOpen]);

  // Handler for starting a new test
  const handleNewTest = useCallback(() => {
    hasShownResults.current = false;
    resultsDialog.close();
    gameState.resetTest();
  }, [resultsDialog, gameState]);

  // Handler for config changes
  const handleConfigChange = useCallback(
    (config: Parameters<typeof gameState.updateConfig>[0]) => {
      hasShownResults.current = false;
      resultsDialog.close();
      gameState.updateConfig(config);
    },
    [resultsDialog, gameState]
  );

  // Check if current result is a new personal best
  const isNewPersonalBest = useCallback(() => {
    if (!gameState.gameState.isComplete) return false;

    const { config } = gameState.gameState;
    const currentBest = config.mode === "time"
      ? gameState.personalBests.time[config.timeLimit]
      : gameState.personalBests.words[config.wordCount];

    if (!currentBest) return true;

    const currentResult = gameState.getTestResult();
    if (!currentResult) return false;

    return currentResult.wpm > currentBest.wpm;
  }, [gameState]);

  // Get current personal best for display
  const getCurrentPersonalBest = useCallback(() => {
    const { config } = gameState.gameState;
    return config.mode === "time"
      ? gameState.personalBests.time[config.timeLimit]
      : gameState.personalBests.words[config.wordCount];
  }, [gameState]);

  return {
    // State
    gameState: gameState.gameState,
    testConfig: gameState.testConfig,
    personalBests: gameState.personalBests,
    mounted: gameState.mounted,

    // Computed
    isNewPersonalBest: isNewPersonalBest(),
    currentPersonalBest: getCurrentPersonalBest(),
    testResult: gameState.getTestResult(),

    // Actions
    handleCharacterInput: gameState.handleCharacterInput,
    handleBackspace: gameState.handleBackspace,
    handleNewTest,
    handleConfigChange,
    startTest: gameState.startTest,
    endTest: gameState.endTest,

    // Dialogs
    instructionsDialog,
    resultsDialog,

    // Refs
    inputRef,
  };
}
