"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Tile, Direction } from "../types";
import {
  initializeTiles,
  performTileMove,
  canMoveTiles,
} from "../logic/tileGameLogic";
import { BEST_SCORE_KEY, GAME_STATE_KEY } from "../constants";

interface SavedGameState {
  tiles: Tile[];
  score: number;
  won: boolean;
  keepPlaying: boolean;
}

/**
 * Loads saved game state from localStorage
 */
function loadSavedGameState(): SavedGameState | null {
  if (typeof window === "undefined") return null;

  try {
    const saved = localStorage.getItem(GAME_STATE_KEY);
    if (!saved) return null;

    const parsed = JSON.parse(saved) as SavedGameState;

    // Validate the saved state has required properties
    if (
      !parsed.tiles ||
      !Array.isArray(parsed.tiles) ||
      typeof parsed.score !== "number"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

/**
 * Saves game state to localStorage
 */
function saveGameState(state: SavedGameState): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  } catch {
    // Silently fail if localStorage is full or unavailable
  }
}

/**
 * Clears saved game state from localStorage
 */
function clearSavedGameState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GAME_STATE_KEY);
}

export function useTileGameState() {
  // Initialize with empty array to avoid hydration mismatch
  // (initializeTiles uses random values that differ between server and client)
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [keepPlaying, setKeepPlaying] = useState(false);

  // Track if we've initialized from storage to prevent race conditions
  const hasInitialized = useRef(false);

  // Initialize tiles and load saved state on mount (client-side only)
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Load best score from localStorage
    const savedBestScore = localStorage.getItem(BEST_SCORE_KEY);
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore, 10));
    }

    // Try to load saved game state
    const savedState = loadSavedGameState();

    if (savedState && savedState.tiles.length > 0) {
      // Restore saved game
      setTiles(savedState.tiles);
      setScore(savedState.score);
      setWon(savedState.won);
      setKeepPlaying(savedState.keepPlaying);

      // Check if the restored game is already over
      if (!canMoveTiles(savedState.tiles)) {
        setGameOver(true);
      }
    } else {
      // Start fresh game
      setTiles(initializeTiles());
    }
  }, []);

  // Save game state whenever it changes
  useEffect(() => {
    // Don't save if we haven't initialized yet or if tiles are empty
    if (!hasInitialized.current || tiles.length === 0) return;

    // Don't save if game is over (let them start fresh next time)
    if (gameOver) {
      clearSavedGameState();
      return;
    }

    saveGameState({
      tiles,
      score,
      won,
      keepPlaying,
    });
  }, [tiles, score, won, keepPlaying, gameOver]);

  // Update best score in localStorage when score changes
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      if (typeof window !== "undefined") {
        localStorage.setItem(BEST_SCORE_KEY, score.toString());
      }
    }
  }, [score, bestScore]);

  const startNewGame = useCallback(() => {
    const newTiles = initializeTiles();
    setTiles(newTiles);
    setScore(0);
    setGameOver(false);
    setWon(false);
    setKeepPlaying(false);
    clearSavedGameState();
  }, []);

  const handleMove = useCallback(
    (direction: Direction) => {
      if (gameOver) {
        return;
      }

      // If won and not continuing, don't allow moves
      if (won && !keepPlaying) {
        return;
      }

      const result = performTileMove(tiles, direction);

      if (result.moved) {
        setTiles(result.tiles);
        setScore((prevScore) => prevScore + result.scoreGained);

        // Check for win condition
        if (result.won && !won) {
          setWon(true);
        }

        // Check for game over (use setTimeout to allow animation to start)
        setTimeout(() => {
          if (!canMoveTiles(result.tiles)) {
            setGameOver(true);
          }
        }, 0);
      }
    },
    [tiles, gameOver, won, keepPlaying]
  );

  const continueAfterWin = useCallback(() => {
    setKeepPlaying(true);
  }, []);

  return {
    tiles,
    score,
    bestScore,
    gameOver,
    won,
    keepPlaying,
    startNewGame,
    handleMove,
    continueAfterWin,
  };
}
