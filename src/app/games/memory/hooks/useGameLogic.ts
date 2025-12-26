"use client";

import { useCallback, useRef, useState } from "react";
import { useGameState } from "./useGameState";
import { Difficulty, CustomSettings } from "../types";
import {
  canFlipCard,
  flipCard,
  checkMatch,
  markAsMatched,
  resetFlippedCards,
  isGameWon,
} from "../logic/game";
import { useDialogState } from "@/lib/hooks/useDialogState";
import { useTimer } from "@/lib/hooks/useTimer";
import { MATCH_CHECK_DELAY, MATCH_ANIMATION_DELAY } from "../constants";

export function useGameLogic() {
  const {
    gameState,
    bestScores,
    savedCustomSettings,
    updateState,
    resetGame,
    setDifficulty,
    updateBestScore,
    getCurrentBestScore,
  } = useGameState();

  const instructionsDialog = useDialogState();
  const customModeDialog = useDialogState();
  const timer = useTimer();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isNewBestScore, setIsNewBestScore] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timeout on unmount
  const clearTimeoutRef = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Handle card click
  const handleCardClick = useCallback(
    (cardIndex: number) => {
      // Ignore clicks while processing
      if (isProcessing || gameState.gameOver) return;

      // Check if we can flip this card
      if (!canFlipCard(gameState.cards, cardIndex, gameState.flippedCards)) {
        return;
      }

      // Start timer on first card flip
      if (!gameState.gameStarted) {
        timer.start();
        updateState({ gameStarted: true });
      }

      // Flip the card
      const newCards = flipCard(gameState.cards, cardIndex);
      const newFlippedCards = [...gameState.flippedCards, cardIndex];

      updateState({
        cards: newCards,
        flippedCards: newFlippedCards,
      });

      // If we have 2 cards flipped, check for match
      if (newFlippedCards.length === 2) {
        setIsProcessing(true);
        const newMoves = gameState.moves + 1;

        const isMatch = checkMatch(newCards, newFlippedCards);

        if (isMatch) {
          // Cards match!
          timeoutRef.current = setTimeout(() => {
            const matchedCards = markAsMatched(newCards, newFlippedCards);
            const newMatches = gameState.matches + 1;

            // Check if game is won
            if (isGameWon(matchedCards)) {
              timer.stop();
              const isBestScore = updateBestScore(newMoves);
              setIsNewBestScore(isBestScore);
              updateState({
                cards: matchedCards,
                flippedCards: [],
                moves: newMoves,
                matches: newMatches,
                gameOver: true,
                won: true,
              });
            } else {
              updateState({
                cards: matchedCards,
                flippedCards: [],
                moves: newMoves,
                matches: newMatches,
              });
            }
            setIsProcessing(false);
          }, MATCH_ANIMATION_DELAY);
        } else {
          // Cards don't match - flip them back after a delay
          timeoutRef.current = setTimeout(() => {
            const resetCards = resetFlippedCards(newCards, newFlippedCards);
            updateState({
              cards: resetCards,
              flippedCards: [],
              moves: newMoves,
            });
            setIsProcessing(false);
          }, MATCH_CHECK_DELAY);
        }
      }
    },
    [
      gameState.cards,
      gameState.flippedCards,
      gameState.gameOver,
      gameState.gameStarted,
      gameState.moves,
      gameState.matches,
      isProcessing,
      timer,
      updateState,
      updateBestScore,
    ]
  );

  // Handle new game
  const handleNewGame = useCallback(() => {
    clearTimeoutRef();
    timer.reset();
    resetGame();
    setIsProcessing(false);
    setIsNewBestScore(false);
  }, [clearTimeoutRef, timer, resetGame]);

  // Handle difficulty change
  const handleDifficultyChange = useCallback(
    (difficulty: Difficulty, customSettings?: CustomSettings) => {
      clearTimeoutRef();
      timer.reset();
      setDifficulty(difficulty, customSettings);
      setIsProcessing(false);
      setIsNewBestScore(false);
    },
    [clearTimeoutRef, timer, setDifficulty]
  );

  // Handle custom mode selection
  const handleCustomModeStart = useCallback(
    (customSettings: CustomSettings) => {
      handleDifficultyChange('custom', customSettings);
    },
    [handleDifficultyChange]
  );

  // Get status message
  const getStatusMessage = (): string => {
    if (gameState.won) {
      return `You won in ${gameState.moves} moves!`;
    }
    if (!gameState.gameStarted) {
      return "Flip two cards to find matching pairs";
    }
    return `Moves: ${gameState.moves} | Pairs: ${gameState.matches}/${gameState.totalPairs}`;
  };

  // Get current best score (uses the hook's method)
  const currentBest = getCurrentBestScore();

  return {
    gameState,
    bestScores,
    savedCustomSettings,
    currentBest,
    timer,
    isProcessing,
    isNewBestScore,
    statusMessage: getStatusMessage(),
    handleCardClick,
    handleNewGame,
    handleDifficultyChange,
    handleCustomModeStart,
    instructionsDialog,
    customModeDialog,
  };
}
