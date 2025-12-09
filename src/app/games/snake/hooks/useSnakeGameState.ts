"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Difficulty, Direction, HighScores } from "../types";
import {
  initializeGameState,
  processGameTick,
  isValidDirectionChange,
} from "../logic/snakeLogic";
import {
  DIFFICULTY_CONFIG,
  DEFAULT_DIFFICULTY,
  HIGH_SCORES_KEY,
} from "../constants";
import { createStorage } from "../utils/storage";

const highScoresStorage = createStorage<HighScores>(HIGH_SCORES_KEY);

export function useSnakeGameState() {
  const [difficulty, setDifficulty] = useState<Difficulty>(DEFAULT_DIFFICULTY);
  const [gameState, setGameState] = useState(() =>
    initializeGameState(DIFFICULTY_CONFIG[DEFAULT_DIFFICULTY].gridSize)
  );
  const [highScores, setHighScores] = useState<HighScores>({});
  const [isRunning, setIsRunning] = useState(false);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitialized = useRef(false);

  // Load high scores on mount
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const saved = highScoresStorage.load();
    if (saved) {
      setHighScores(saved);
    }
  }, []);

  // Save high scores when they change
  const saveHighScore = useCallback(
    (score: number, diff: Difficulty) => {
      const currentBest = highScores[diff] ?? 0;
      if (score > currentBest) {
        const newHighScores = { ...highScores, [diff]: score };
        setHighScores(newHighScores);
        highScoresStorage.save(newHighScores);
      }
    },
    [highScores]
  );

  // Game loop
  useEffect(() => {
    if (!isRunning || gameState.gameOver || gameState.isPaused) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    const config = DIFFICULTY_CONFIG[difficulty];

    gameLoopRef.current = setInterval(() => {
      setGameState((prev) => {
        const newState = processGameTick(prev, config.gridSize);

        // Save high score if game just ended
        if (newState.gameOver && !prev.gameOver) {
          saveHighScore(newState.score, difficulty);
        }

        return newState;
      });
    }, config.speed);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [isRunning, gameState.gameOver, gameState.isPaused, difficulty, saveHighScore]);

  // Change direction
  const changeDirection = useCallback((newDirection: Direction) => {
    setGameState((prev) => {
      // Only change if valid (not reversing)
      if (!isValidDirectionChange(prev.direction, newDirection)) {
        return prev;
      }
      return { ...prev, nextDirection: newDirection };
    });
  }, []);

  // Start game
  const startGame = useCallback(() => {
    if (gameState.gameOver) {
      // Reset if game is over
      setGameState(initializeGameState(DIFFICULTY_CONFIG[difficulty].gridSize));
    }
    setIsRunning(true);
  }, [difficulty, gameState.gameOver]);

  // Pause/Resume game
  const togglePause = useCallback(() => {
    if (gameState.gameOver) return;

    setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  }, [gameState.gameOver]);

  // Start new game
  const startNewGame = useCallback(
    (newDifficulty?: Difficulty) => {
      const diff = newDifficulty ?? difficulty;
      if (newDifficulty) {
        setDifficulty(newDifficulty);
      }
      setGameState(initializeGameState(DIFFICULTY_CONFIG[diff].gridSize));
      setIsRunning(false);
    },
    [difficulty]
  );

  // Change difficulty (starts new game)
  const changeDifficulty = useCallback(
    (newDifficulty: Difficulty) => {
      if (newDifficulty !== difficulty) {
        setDifficulty(newDifficulty);
        setGameState(initializeGameState(DIFFICULTY_CONFIG[newDifficulty].gridSize));
        setIsRunning(false);
      }
    },
    [difficulty]
  );

  return {
    // State
    snake: gameState.snake,
    food: gameState.food,
    direction: gameState.direction,
    score: gameState.score,
    gameOver: gameState.gameOver,
    won: gameState.won,
    isPaused: gameState.isPaused,
    isRunning,
    difficulty,
    gridSize: DIFFICULTY_CONFIG[difficulty].gridSize,
    highScores,
    highScore: highScores[difficulty] ?? 0,

    // Actions
    changeDirection,
    startGame,
    togglePause,
    startNewGame,
    changeDifficulty,
  };
}
