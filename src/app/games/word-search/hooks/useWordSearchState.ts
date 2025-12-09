"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { GameState, Difficulty, SavedGameState } from "../types";
import { createInitialGameState, GAME_STATE_KEY, DIFFICULTY_CONFIG } from "../constants";
import { generateWordSearchGrid } from "../logic/gridGenerator";
import { getRandomWordsFromCategory } from "../data/categories";
import { createStorage } from "../utils/storage";

const gameStorage = createStorage<SavedGameState>(GAME_STATE_KEY);

/**
 * Hook for managing Word Search game state
 */
export function useWordSearchState() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState);
  const [mounted, setMounted] = useState(false);
  const initializedRef = useRef(false);

  // Initialize game on mount
  useEffect(() => {
    setMounted(true);

    // Try to load saved game
    const savedState = gameStorage.load();
    if (savedState && savedState.grid.length > 0) {
      setGameState(savedState);
    } else {
      // Start a new game with default settings
      startNewGame("animals", "medium");
    }

    initializedRef.current = true;
  }, []);

  // Save game state whenever it changes
  useEffect(() => {
    if (mounted && initializedRef.current && gameState.grid.length > 0) {
      gameStorage.save(gameState);
    }
  }, [gameState, mounted]);

  /**
   * Start a new game with the specified category and difficulty
   */
  const startNewGame = useCallback(
    (category: string, difficulty: Difficulty) => {
      const config = DIFFICULTY_CONFIG[difficulty];
      const words = getRandomWordsFromCategory(category, config.wordCount);
      const { grid, placedWords } = generateWordSearchGrid(words, difficulty);

      setGameState({
        grid,
        words: placedWords,
        foundWords: [],
        category,
        difficulty,
        gameWon: false,
        startTime: Date.now(),
        endTime: null,
      });
    },
    []
  );

  /**
   * Mark a word as found
   */
  const markWordFound = useCallback((word: string) => {
    setGameState((prev) => {
      // Check if word is already found
      if (prev.foundWords.includes(word)) {
        return prev;
      }

      // Update the placed words to mark as found
      const updatedWords = prev.words.map((w) =>
        w.word === word ? { ...w, found: true } : w
      );

      const newFoundWords = [...prev.foundWords, word];
      const gameWon = newFoundWords.length === prev.words.length;

      return {
        ...prev,
        words: updatedWords,
        foundWords: newFoundWords,
        gameWon,
        endTime: gameWon ? Date.now() : prev.endTime,
      };
    });
  }, []);

  /**
   * Change difficulty and start new game
   */
  const changeDifficulty = useCallback(
    (difficulty: Difficulty) => {
      startNewGame(gameState.category, difficulty);
    },
    [gameState.category, startNewGame]
  );

  /**
   * Change category and start new game
   */
  const changeCategory = useCallback(
    (category: string) => {
      startNewGame(category, gameState.difficulty);
    },
    [gameState.difficulty, startNewGame]
  );

  /**
   * Reset the current game (same category and difficulty)
   */
  const resetGame = useCallback(() => {
    startNewGame(gameState.category, gameState.difficulty);
  }, [gameState.category, gameState.difficulty, startNewGame]);

  return {
    gameState,
    mounted,
    startNewGame,
    markWordFound,
    changeDifficulty,
    changeCategory,
    resetGame,
  };
}
