"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { GameState, SavedGameState, Difficulty, BestRecords, Direction } from "../types";
import {
  GAME_STATE_KEY,
  BEST_RECORDS_KEY,
  DIFFICULTY_GRID_SIZE,
  createInitialGameState,
} from "../constants";
import { createStorage } from "../utils/storage";
import {
  moveTile,
  moveByDirection,
  shuffleTiles,
  isSolved,
} from "../logic/puzzleLogic";

const gameStateStorage = createStorage<SavedGameState>(GAME_STATE_KEY);
const bestRecordsStorage = createStorage<BestRecords>(BEST_RECORDS_KEY);

export function useSlidingPuzzleState() {
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialGameState("medium")
  );
  const [bestRecords, setBestRecords] = useState<BestRecords>({});
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved state on mount
  useEffect(() => {
    const savedState = gameStateStorage.load();
    if (savedState && !savedState.won) {
      // Resume saved game if not won
      setGameState({
        tiles: savedState.tiles,
        gridSize: savedState.gridSize,
        moves: savedState.moves,
        time: savedState.time,
        gameStarted: savedState.gameStarted,
        won: savedState.won,
        difficulty: savedState.difficulty,
      });
    }

    const savedBestRecords = bestRecordsStorage.load();
    if (savedBestRecords) {
      setBestRecords(savedBestRecords);
    }

    setMounted(true);
  }, []);

  // Save state when it changes
  useEffect(() => {
    if (!mounted) return;

    const saveState: SavedGameState = {
      ...gameState,
      savedAt: Date.now(),
    };
    gameStateStorage.save(saveState);
  }, [gameState, mounted]);

  // Save best records when they change
  useEffect(() => {
    if (!mounted) return;
    bestRecordsStorage.save(bestRecords);
  }, [bestRecords, mounted]);

  // Timer effect
  useEffect(() => {
    if (gameState.gameStarted && !gameState.won) {
      timerRef.current = setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          time: prev.time + 1,
        }));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.gameStarted, gameState.won]);

  // Check for new best record when game is won
  const checkAndUpdateBestRecord = useCallback(
    (moves: number, time: number, difficulty: Difficulty) => {
      setBestRecords((prev) => {
        const currentBest = prev[difficulty];

        // Determine if this is a new best (prioritize fewer moves, then shorter time)
        if (
          !currentBest ||
          moves < currentBest.moves ||
          (moves === currentBest.moves && time < currentBest.time)
        ) {
          return {
            ...prev,
            [difficulty]: { moves, time },
          };
        }

        return prev;
      });
    },
    []
  );

  // Handle tile click
  const handleTileClick = useCallback(
    (tileIndex: number) => {
      if (gameState.won) return;

      const newTiles = moveTile(gameState.tiles, tileIndex, gameState.gridSize);
      if (!newTiles) return; // Invalid move

      const won = isSolved(newTiles);
      const newMoves = gameState.moves + 1;

      setGameState((prev) => ({
        ...prev,
        tiles: newTiles,
        moves: newMoves,
        gameStarted: true,
        won,
      }));

      if (won) {
        checkAndUpdateBestRecord(newMoves, gameState.time, gameState.difficulty);
      }
    },
    [gameState, checkAndUpdateBestRecord]
  );

  // Handle keyboard/swipe direction
  const handleMove = useCallback(
    (direction: Direction) => {
      if (gameState.won) return;

      const newTiles = moveByDirection(
        gameState.tiles,
        direction,
        gameState.gridSize
      );
      if (!newTiles) return; // Invalid move

      const won = isSolved(newTiles);
      const newMoves = gameState.moves + 1;

      setGameState((prev) => ({
        ...prev,
        tiles: newTiles,
        moves: newMoves,
        gameStarted: true,
        won,
      }));

      if (won) {
        checkAndUpdateBestRecord(newMoves, gameState.time, gameState.difficulty);
      }
    },
    [gameState, checkAndUpdateBestRecord]
  );

  // Start new game
  const startNewGame = useCallback(
    (newDifficulty?: Difficulty) => {
      const difficulty = newDifficulty || gameState.difficulty;
      const gridSize = DIFFICULTY_GRID_SIZE[difficulty];
      const tiles = shuffleTiles(gridSize);

      setGameState({
        tiles,
        gridSize,
        moves: 0,
        time: 0,
        gameStarted: false,
        won: false,
        difficulty,
      });
    },
    [gameState.difficulty]
  );

  // Shuffle current puzzle
  const shufflePuzzle = useCallback(() => {
    const tiles = shuffleTiles(gameState.gridSize);

    setGameState((prev) => ({
      ...prev,
      tiles,
      moves: 0,
      time: 0,
      gameStarted: false,
      won: false,
    }));
  }, [gameState.gridSize]);

  return {
    // State
    gameState,
    bestRecords,
    mounted,

    // Actions
    handleTileClick,
    handleMove,
    startNewGame,
    shufflePuzzle,
  };
}
