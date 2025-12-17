"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Tile, Direction } from "../types";
import {
  initializeTiles,
  performTileMove,
  canMoveTiles,
} from "../logic/tileGameLogic";
import { BEST_SCORE_KEY, GAME_STATE_KEY } from "../constants";
import { createStorage, storage } from "@/lib/utils/storage";

interface SavedGameState {
  tiles: Tile[];
  score: number;
  won: boolean;
  keepPlaying: boolean;
}

// Create type-safe storage for game state
const gameStateStorage = createStorage<SavedGameState>(GAME_STATE_KEY);

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
    const savedBestScore = storage.get<number>(BEST_SCORE_KEY);
    if (savedBestScore) {
      setBestScore(savedBestScore);
    }

    // Try to load saved game state
    const savedState = gameStateStorage.load();

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
      gameStateStorage.clear();
      return;
    }

    gameStateStorage.save({
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
      storage.set(BEST_SCORE_KEY, score);
    }
  }, [score, bestScore]);

  const startNewGame = useCallback(() => {
    const newTiles = initializeTiles();
    setTiles(newTiles);
    setScore(0);
    setGameOver(false);
    setWon(false);
    setKeepPlaying(false);
    gameStateStorage.clear();
  }, []);

  const handleMove = useCallback(
    (direction: Direction) => {
      if (gameOver) {
        return;
      }

      // Note: We allow moves even after winning, regardless of keepPlaying state.
      // The win dialog uses independent state and closing it with X should not block gameplay.
      // The keepPlaying flag is primarily used to track if user explicitly chose to continue
      // (for saved state purposes).

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
    [tiles, gameOver, won]
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
