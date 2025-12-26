"use client";

import { useState, useCallback, useEffect } from "react";
import { GameState, Difficulty, BestScores, CustomSettings } from "../types";
import { createNewGame } from "../logic/game";
import { createStorage } from "@/lib/utils/storage";
import { BEST_SCORES_KEY, CUSTOM_SETTINGS_KEY, DEFAULT_DIFFICULTY } from "../constants";

const bestScoresStorage = createStorage<BestScores>(BEST_SCORES_KEY);
const customSettingsStorage = createStorage<CustomSettings>(CUSTOM_SETTINGS_KEY);

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() =>
    createNewGame(DEFAULT_DIFFICULTY)
  );
  const [bestScores, setBestScores] = useState<BestScores>({});
  const [savedCustomSettings, setSavedCustomSettings] = useState<CustomSettings | undefined>();

  // Load best scores and custom settings from localStorage on mount
  useEffect(() => {
    const savedBest = bestScoresStorage.load();
    if (savedBest) {
      setBestScores(savedBest);
    }
    const savedCustom = customSettingsStorage.load();
    if (savedCustom) {
      setSavedCustomSettings(savedCustom);
    }
  }, []);

  // Update state partially
  const updateState = useCallback((updates: Partial<GameState>) => {
    setGameState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Reset the game with current difficulty and settings
  const resetGame = useCallback(() => {
    setGameState(createNewGame(gameState.difficulty, gameState.customSettings));
  }, [gameState.difficulty, gameState.customSettings]);

  // Start a new game with a specific difficulty
  const newGame = useCallback((difficulty: Difficulty, customSettings?: CustomSettings) => {
    setGameState(createNewGame(difficulty, customSettings));
    if (customSettings) {
      setSavedCustomSettings(customSettings);
      customSettingsStorage.save(customSettings);
    }
  }, []);

  // Change difficulty and start new game
  const setDifficulty = useCallback((difficulty: Difficulty, customSettings?: CustomSettings) => {
    setGameState(createNewGame(difficulty, customSettings));
    if (customSettings) {
      setSavedCustomSettings(customSettings);
      customSettingsStorage.save(customSettings);
    }
  }, []);

  // Get the best score key for custom mode (includes dimensions)
  const getBestScoreKey = useCallback((difficulty: Difficulty, customSettings?: CustomSettings): string => {
    if (difficulty === 'custom' && customSettings) {
      return `custom_${customSettings.rows}x${customSettings.cols}`;
    }
    return difficulty;
  }, []);

  // Update best score if current score is better (fewer moves)
  const updateBestScore = useCallback(
    (moves: number) => {
      const key = getBestScoreKey(gameState.difficulty, gameState.customSettings);
      const currentBest = bestScores[key];
      if (currentBest === undefined || moves < currentBest) {
        const newBestScores = {
          ...bestScores,
          [key]: moves,
        };
        setBestScores(newBestScores);
        bestScoresStorage.save(newBestScores);
        return true; // New best score!
      }
      return false;
    },
    [bestScores, gameState.difficulty, gameState.customSettings, getBestScoreKey]
  );

  // Get current best score (handles custom mode)
  const getCurrentBestScore = useCallback((): number | undefined => {
    const key = getBestScoreKey(gameState.difficulty, gameState.customSettings);
    return bestScores[key];
  }, [bestScores, gameState.difficulty, gameState.customSettings, getBestScoreKey]);

  return {
    gameState,
    bestScores,
    savedCustomSettings,
    updateState,
    resetGame,
    newGame,
    setDifficulty,
    updateBestScore,
    getCurrentBestScore,
  };
}
