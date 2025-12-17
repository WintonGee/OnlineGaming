"use client";

import { useState, useEffect, useCallback } from "react";
import {
  GameState,
  SavedGameState,
  Guess,
  GameMode,
  DailyState,
} from "../types";
import {
  WORD_LENGTH,
  MAX_GUESSES,
  GAME_STATE_KEY,
  DAILY_STATE_KEY,
} from "../constants";
import { createStorage } from "@/lib/utils/storage";
import { getRandomSolution } from "../logic/wordList";
import { checkGuess, validateGuess, isWinningGuess } from "../logic/validation";

const gameStateStorage = createStorage<SavedGameState>(GAME_STATE_KEY);
const dailyStateStorage = createStorage<DailyState>(DAILY_STATE_KEY);

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function useWordleGameState() {
  const [mounted, setMounted] = useState(false);
  const [dailyCompleted, setDailyCompleted] = useState<DailyState | null>(null);
  const [justCompleted, setJustCompleted] = useState(false);
  const [gameState, setGameState] = useState<GameState>(() => {
    return {
      currentGuess: "",
      guesses: [],
      solution: getRandomSolution(false), // Use random word for each game
      gameOver: false,
      won: false,
      attempt: 0,
      mode: "random" as GameMode,
    };
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  // Load saved state on client-side mount
  useEffect(() => {
    const saved = gameStateStorage.load();
    const dailySaved = dailyStateStorage.load();
    const today = getTodayDateString();

    // Check if there's a completed daily for today
    if (dailySaved && dailySaved.date === today && dailySaved.completed) {
      setDailyCompleted(dailySaved);
    }

    if (saved) {
      // Remove wordLength and hardMode from saved state for backward compatibility
      const { wordLength, hardMode, startTime, endTime, mode, ...rest } = saved;
      const savedMode = mode || "random";

      // If mode is daily and already completed today, show completed state
      if (
        savedMode === "daily" &&
        dailySaved?.date === today &&
        dailySaved?.completed
      ) {
        setGameState({
          currentGuess: "",
          guesses: dailySaved.guesses,
          solution: dailySaved.solution,
          gameOver: true,
          won: dailySaved.won,
          attempt: dailySaved.guesses.length,
          mode: "daily",
        });
      } else if (savedMode === "daily" && dailySaved?.date !== today) {
        // New day, start fresh daily
        setGameState({
          currentGuess: "",
          guesses: [],
          solution: getRandomSolution(true),
          gameOver: false,
          won: false,
          attempt: 0,
          mode: "daily",
        });
      } else {
        setGameState({
          ...rest,
          mode: savedMode,
        });
      }
    }
    setMounted(true);
  }, []);

  // Save game state to localStorage
  useEffect(() => {
    if (!mounted) return; // Don't save until we've loaded the saved state
    const { currentGuess, guesses, solution, gameOver, won, attempt, mode } =
      gameState;
    gameStateStorage.save({
      currentGuess,
      guesses,
      solution,
      gameOver,
      won,
      attempt,
      mode,
    });
  }, [gameState, mounted]);

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
    const newGuesses = [...gameState.guesses, newGuess];

    const newGameState: GameState = {
      ...gameState,
      currentGuess: "",
      guesses: newGuesses,
      gameOver,
      won,
      attempt: newAttempt,
    };

    // If daily mode and game is over, save daily completion
    if (gameState.mode === "daily" && gameOver) {
      const dailyState: DailyState = {
        date: getTodayDateString(),
        guesses: newGuesses,
        solution: gameState.solution,
        won,
        completed: true,
      };
      dailyStateStorage.save(dailyState);
      setDailyCompleted(dailyState);
    }

    if (gameOver) {
      setJustCompleted(true);
    }

    setGameState(newGameState);
  }, [gameState]);

  const newGame = useCallback(() => {
    // Always switch to random mode for new game (daily can only be played once per day)
    const newGameState: GameState = {
      currentGuess: "",
      guesses: [],
      solution: getRandomSolution(false),
      gameOver: false,
      won: false,
      attempt: 0,
      mode: "random",
    };
    setGameState(newGameState);
    setJustCompleted(false);
    setErrorMessage(null);
    setShake(false);
  }, []);

  const setMode = useCallback((newMode: GameMode) => {
    setJustCompleted(false);
    if (newMode === "daily") {
      const today = getTodayDateString();
      const dailySaved = dailyStateStorage.load();

      // Check if already completed today's daily
      if (dailySaved && dailySaved.date === today && dailySaved.completed) {
        setDailyCompleted(dailySaved);
        setGameState({
          currentGuess: "",
          guesses: dailySaved.guesses,
          solution: dailySaved.solution,
          gameOver: true,
          won: dailySaved.won,
          attempt: dailySaved.guesses.length,
          mode: "daily",
        });
      } else {
        // Start fresh daily or continue existing one
        setDailyCompleted(null);
        setGameState({
          currentGuess: "",
          guesses: [],
          solution: getRandomSolution(true),
          gameOver: false,
          won: false,
          attempt: 0,
          mode: "daily",
        });
      }
    } else {
      setDailyCompleted(null);
      setGameState({
        currentGuess: "",
        guesses: [],
        solution: getRandomSolution(false),
        gameOver: false,
        won: false,
        attempt: 0,
        mode: "random",
      });
    }
    setErrorMessage(null);
    setShake(false);
  }, []);

  const dismissResult = useCallback(() => {
    setJustCompleted(false);
  }, []);

  const revealWord = useCallback(() => {
    if (gameState.gameOver) return;

    // Show the solution as an error message
    setErrorMessage(`The word is: ${gameState.solution}`);
  }, [gameState.gameOver, gameState.solution]);

  return {
    gameState,
    errorMessage,
    shake,
    dailyCompleted,
    justCompleted,
    addLetter,
    removeLetter,
    submitGuess,
    newGame,
    setMode,
    dismissResult,
    revealWord,
  };
}
