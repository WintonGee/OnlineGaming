"use client";

import { useState, useEffect, useCallback } from "react";
import { GameState, SavedGameState, Guess } from "../types";
import {
  WORD_LENGTH,
  MAX_GUESSES,
  GAME_STATE_KEY,
} from "../constants";
import { createStorage } from "../utils/storage";
import { getRandomSolution } from "../logic/wordList";
import {
  checkGuess,
  validateGuess,
  isWinningGuess,
} from "../logic/validation";

const gameStateStorage = createStorage<SavedGameState>(GAME_STATE_KEY);

export function useWordleGameState() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = gameStateStorage.load();
    if (saved) {
      // Remove wordLength and hardMode from saved state for backward compatibility
      const { wordLength, hardMode, startTime, endTime, ...rest } = saved;
      return { ...rest };
    }

    return {
      currentGuess: "",
      guesses: [],
      solution: getRandomSolution(true), // Use daily word
      gameOver: false,
      won: false,
      attempt: 0,
    };
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  // Save game state to localStorage
  useEffect(() => {
    const { currentGuess, guesses, solution, gameOver, won, attempt } = gameState;
    gameStateStorage.save({
      currentGuess,
      guesses,
      solution,
      gameOver,
      won,
      attempt,
    });
  }, [gameState]);

  // Clear error message after 2 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Clear shake animation after 500ms
  useEffect(() => {
    if (shake) {
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [shake]);

  const addLetter = useCallback(
    (letter: string) => {
      if (gameState.gameOver) return;
      if (gameState.currentGuess.length >= WORD_LENGTH) return;

      setGameState((prev) => ({
        ...prev,
        currentGuess: prev.currentGuess + letter.toUpperCase(),
      }));
    },
    [gameState.gameOver, gameState.currentGuess.length]
  );

  const removeLetter = useCallback(() => {
    if (gameState.gameOver) return;
    if (gameState.currentGuess.length === 0) return;

    setGameState((prev) => ({
      ...prev,
      currentGuess: prev.currentGuess.slice(0, -1),
    }));
  }, [gameState.gameOver, gameState.currentGuess.length]);

  const submitGuess = useCallback(() => {
    if (gameState.gameOver) return;
    if (gameState.currentGuess.length !== WORD_LENGTH) {
      setErrorMessage("Not enough letters");
      setShake(true);
      return;
    }

    // Validate the word
    const validation = validateGuess(gameState.currentGuess);
    if (!validation.valid) {
      setErrorMessage(validation.error || "Invalid word");
      setShake(true);
      return;
    }

    // Check the guess
    const letters = checkGuess(gameState.currentGuess, gameState.solution);
    const newGuess: Guess = {
      word: gameState.currentGuess,
      letters,
    };

    const won = isWinningGuess(gameState.currentGuess, gameState.solution);
    const newAttempt = gameState.attempt + 1;
    const gameOver = won || newAttempt >= MAX_GUESSES;

    const newGameState: GameState = {
      ...gameState,
      currentGuess: "",
      guesses: [...gameState.guesses, newGuess],
      gameOver,
      won,
      attempt: newAttempt,
    };

    setGameState(newGameState);
  }, [gameState]);

  const newGame = useCallback(() => {
    const newGameState: GameState = {
      currentGuess: "",
      guesses: [],
      solution: getRandomSolution(true), // Use daily word
      gameOver: false,
      won: false,
      attempt: 0,
    };
    setGameState(newGameState);
    setErrorMessage(null);
    setShake(false);
  }, []);

  return {
    gameState,
    errorMessage,
    shake,
    addLetter,
    removeLetter,
    submitGuess,
    newGame,
  };
}
