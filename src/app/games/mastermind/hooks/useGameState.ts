"use client";

import { useState, useEffect, useCallback } from "react";
import { GameState, SavedGameState, Guess, PegColor } from "../types";
import { CODE_LENGTH, MAX_ATTEMPTS, GAME_STATE_KEY } from "../constants";
import { createStorage } from "@/lib/utils/storage";
import { generateSecretCode, checkGuess, isGuessComplete, isWinningGuess } from "../logic/validation";

const gameStateStorage = createStorage<SavedGameState>(GAME_STATE_KEY);

export function useGameState() {
  const [mounted, setMounted] = useState(false);
  const [gameState, setGameState] = useState<GameState>(() => {
    return {
      secretCode: generateSecretCode(),
      currentGuess: Array(CODE_LENGTH).fill(null),
      guesses: [],
      gameOver: false,
      won: false,
      selectedSlot: 0,
    };
  });

  // Load saved state on client-side mount
  useEffect(() => {
    const saved = gameStateStorage.load();
    if (saved) {
      setGameState(saved);
    }
    setMounted(true);
  }, []);

  // Save game state to localStorage
  useEffect(() => {
    if (!mounted) return; // Don't save until we've loaded the saved state
    const { secretCode, currentGuess, guesses, gameOver, won, selectedSlot } = gameState;
    gameStateStorage.save({
      secretCode,
      currentGuess,
      guesses,
      gameOver,
      won,
      selectedSlot,
    });
  }, [gameState, mounted]);

  const setColorInSlot = useCallback(
    (color: PegColor | null) => {
      if (gameState.gameOver) return;

      setGameState((prev) => {
        const newGuess = [...prev.currentGuess];
        newGuess[prev.selectedSlot] = color;

        // Auto-advance to next empty slot if we set a color
        let nextSlot = prev.selectedSlot;
        if (color !== null) {
          // Find the next empty slot, wrapping around if needed
          for (let i = 1; i <= CODE_LENGTH; i++) {
            const checkSlot = (prev.selectedSlot + i) % CODE_LENGTH;
            if (newGuess[checkSlot] === null) {
              nextSlot = checkSlot;
              break;
            }
          }
        }

        return {
          ...prev,
          currentGuess: newGuess,
          selectedSlot: nextSlot,
        };
      });
    },
    [gameState.gameOver]
  );

  const setSelectedSlot = useCallback(
    (slot: number) => {
      if (gameState.gameOver) return;
      if (slot < 0 || slot >= CODE_LENGTH) return;

      setGameState((prev) => ({
        ...prev,
        selectedSlot: slot,
      }));
    },
    [gameState.gameOver]
  );

  const submitGuess = useCallback(() => {
    if (gameState.gameOver) return;
    if (!isGuessComplete(gameState.currentGuess)) return;

    const feedback = checkGuess(gameState.currentGuess, gameState.secretCode);
    const newGuess: Guess = {
      pegs: [...gameState.currentGuess] as PegColor[],
      feedback,
    };

    const won = isWinningGuess(gameState.currentGuess as PegColor[], gameState.secretCode);
    const newGuesses = [...gameState.guesses, newGuess];
    const gameOver = won || newGuesses.length >= MAX_ATTEMPTS;

    setGameState({
      ...gameState,
      currentGuess: Array(CODE_LENGTH).fill(null),
      guesses: newGuesses,
      gameOver,
      won,
      selectedSlot: 0,
    });
  }, [gameState]);

  const resetGame = useCallback(() => {
    setGameState({
      secretCode: generateSecretCode(),
      currentGuess: Array(CODE_LENGTH).fill(null),
      guesses: [],
      gameOver: false,
      won: false,
      selectedSlot: 0,
    });
  }, []);

  const revealCode = useCallback(() => {
    if (gameState.gameOver) return;

    setGameState((prev) => ({
      ...prev,
      gameOver: true,
      won: false,
    }));
  }, [gameState.gameOver]);

  return {
    gameState,
    mounted,
    setColorInSlot,
    setSelectedSlot,
    submitGuess,
    resetGame,
    revealCode,
  };
}
