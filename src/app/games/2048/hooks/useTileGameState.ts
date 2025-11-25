"use client";

import { useState, useCallback, useEffect } from "react";
import { Tile, Direction } from "../types";
import { initializeTiles, performTileMove, canMoveTiles } from "../logic/tileGameLogic";
import { BEST_SCORE_KEY } from "../constants";

export function useTileGameState() {
  // Initialize with empty array to avoid hydration mismatch
  // (initializeTiles uses random values that differ between server and client)
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [keepPlaying, setKeepPlaying] = useState(false);

  // Initialize tiles and load best score on mount (client-side only)
  useEffect(() => {
    // Initialize tiles
    setTiles(initializeTiles());

    // Load best score from localStorage
    if (typeof window !== "undefined") {
      const savedBestScore = localStorage.getItem(BEST_SCORE_KEY);
      if (savedBestScore) {
        setBestScore(parseInt(savedBestScore, 10));
      }
    }
  }, []);

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
