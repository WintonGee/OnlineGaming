"use client";

import { useState, useEffect, useCallback } from "react";
import { GameState, SavedGameState } from "../types";
import { MAX_INCORRECT_GUESSES, GAME_STATE_KEY, CATEGORY_CACHE_KEY } from "../constants";
import { createStorage, createSessionStorage } from "@/lib/utils/storage";
import {
  getRandomWord,
  getRandomCategory,
  getRandomWordFromCategories,
} from "../data/categories";

const gameStateStorage = createStorage<SavedGameState>(GAME_STATE_KEY);
const categoryCache = createSessionStorage<string[]>(CATEGORY_CACHE_KEY);

/**
 * Initialize a new game with a random word from a random category
 */
function initializeNewGame(): GameState {
  const category = getRandomCategory();
  const word = getRandomWord(category.name);

  return {
    solution: word,
    category: category.name,
    guessedLetters: [],
    incorrectGuesses: [],
    gameOver: false,
    won: false,
  };
}

/**
 * Hook for managing Hangman game state
 */
export function useHangmanGameState() {
  const [gameState, setGameState] = useState<GameState>(initializeNewGame);
  const [mounted, setMounted] = useState(false);

  // Client-side initialization from localStorage
  useEffect(() => {
    const saved = gameStateStorage.load();
    if (saved) {
      setGameState(saved);
    }
    setMounted(true);
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    if (!mounted) return;
    gameStateStorage.save(gameState);
  }, [gameState, mounted]);

  /**
   * Guess a letter
   */
  const guessLetter = useCallback(
    (letter: string) => {
      if (gameState.gameOver) return;

      const upperLetter = letter.toUpperCase();

      // Check if letter was already guessed
      if (
        gameState.guessedLetters.includes(upperLetter) ||
        gameState.incorrectGuesses.includes(upperLetter)
      ) {
        return;
      }

      // Check if letter is in the solution
      const isCorrect = gameState.solution.includes(upperLetter);

      setGameState((prev) => {
        const newGuessedLetters = isCorrect
          ? [...prev.guessedLetters, upperLetter]
          : prev.guessedLetters;

        const newIncorrectGuesses = !isCorrect
          ? [...prev.incorrectGuesses, upperLetter]
          : prev.incorrectGuesses;

        // Check if won (all letters guessed)
        const uniqueLetters = new Set(prev.solution.split(""));
        const allLettersGuessed = Array.from(uniqueLetters).every((letter) =>
          newGuessedLetters.includes(letter)
        );

        // Check if lost (too many incorrect guesses)
        const lost = newIncorrectGuesses.length >= MAX_INCORRECT_GUESSES;

        return {
          ...prev,
          guessedLetters: newGuessedLetters,
          incorrectGuesses: newIncorrectGuesses,
          won: allLettersGuessed,
          gameOver: allLettersGuessed || lost,
        };
      });
    },
    [
      gameState.gameOver,
      gameState.guessedLetters,
      gameState.incorrectGuesses,
      gameState.solution,
    ]
  );

  /**
   * Start a new game with a random word from cached categories or random category
   */
  const newGame = useCallback(() => {
    const cachedCategories = categoryCache.load();

    if (cachedCategories) {
      // Use cached categories (empty array means all categories)
      const { word, category } = getRandomWordFromCategories(cachedCategories);

      setGameState({
        solution: word,
        category: category,
        guessedLetters: [],
        incorrectGuesses: [],
        gameOver: false,
        won: false,
      });
    } else {
      // Fall back to random category
      setGameState(initializeNewGame());
    }
  }, []);

  /**
   * Start a new game with one or more specific categories
   */
  const newGameWithCategory = useCallback(
    (categoryNames: string | string[]) => {
      // Handle both single category (backward compatibility) and multiple categories
      const categories = Array.isArray(categoryNames)
        ? categoryNames
        : [categoryNames];
      const { word, category } = getRandomWordFromCategories(categories);

      setGameState({
        solution: word,
        category: category,
        guessedLetters: [],
        incorrectGuesses: [],
        gameOver: false,
        won: false,
      });
    },
    []
  );

  /**
   * Reveal the word by adding all letters to guessedLetters
   */
  const revealWord = useCallback(() => {
    setGameState((prev) => {
      // Don't reveal if game is already over
      if (prev.gameOver) return prev;

      // Get all unique letters from the solution
      const uniqueLetters = new Set(prev.solution.split(""));
      const allLetters = Array.from(uniqueLetters);

      return {
        ...prev,
        guessedLetters: allLetters,
        gameOver: true,
        won: false, // Revealing the word counts as losing
      };
    });
  }, []);

  return {
    gameState,
    guessLetter,
    newGame,
    newGameWithCategory,
    revealWord,
    mounted,
  };
}
