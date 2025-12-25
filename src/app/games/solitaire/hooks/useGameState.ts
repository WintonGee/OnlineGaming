"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { GameState, CardLocation, Card } from "../types";
import { createNewGame, createEmptyState, drawFromStock, moveCards, autoMoveToFoundation, autoCompleteStep, canAutoComplete } from "../logic/game";
import { createStorage } from "@/lib/utils/storage";
import { GAME_STATE_KEY, STATS_KEY, AUTO_COMPLETE_DELAY } from "../constants";

interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  bestMoves: number | null;
}

const gameStateStorage = createStorage<GameState>(GAME_STATE_KEY);
const statsStorage = createStorage<GameStats>(STATS_KEY);

export function useGameState() {
  // Use empty state for SSR to avoid hydration mismatch (Math.random in createNewGame)
  const [gameState, setGameState] = useState<GameState>(() => createEmptyState(1));
  const [isInitialized, setIsInitialized] = useState(false);
  const [stats, setStats] = useState<GameStats>({
    gamesPlayed: 0,
    gamesWon: 0,
    bestMoves: null,
  });
  const [isAutoCompleting, setIsAutoCompleting] = useState(false);
  const [selectedCard, setSelectedCard] = useState<{
    card: Card;
    source: CardLocation;
  } | null>(null);

  // Load saved state and stats on mount (client-side only)
  useEffect(() => {
    const savedState = gameStateStorage.load();
    const savedStats = statsStorage.load();

    if (savedState && !savedState.won) {
      setGameState(savedState);
    } else {
      // No saved state, create a new game
      setGameState(createNewGame(1));
    }

    if (savedStats) {
      setStats(savedStats);
    }

    setIsInitialized(true);
  }, []);

  // Save state on changes
  useEffect(() => {
    if (gameState.gameStarted && !gameState.won) {
      gameStateStorage.save(gameState);
    }
  }, [gameState]);

  const hasRecordedWin = useRef(false);

  // Handle win
  useEffect(() => {
    if (gameState.won && !hasRecordedWin.current) {
      hasRecordedWin.current = true;
      gameStateStorage.clear();

      setStats(prev => {
        const newStats = {
          gamesPlayed: prev.gamesPlayed,
          gamesWon: prev.gamesWon + 1,
          bestMoves: prev.bestMoves === null
            ? gameState.moves
            : Math.min(prev.bestMoves, gameState.moves),
        };
        statsStorage.save(newStats);
        return newStats;
      });
    } else if (!gameState.won) {
      hasRecordedWin.current = false;
    }
  }, [gameState.won, gameState.moves]);

  // Auto-complete logic
  useEffect(() => {
    if (!isAutoCompleting) return;

    const step = () => {
      setGameState(prev => {
        const next = autoCompleteStep(prev);
        if (next === null) {
          setIsAutoCompleting(false);
          return prev;
        }
        return next;
      });
    };

    const timer = setTimeout(step, AUTO_COMPLETE_DELAY);
    return () => clearTimeout(timer);
  }, [isAutoCompleting, gameState]);

  const handleDraw = useCallback(() => {
    setSelectedCard(null);
    setGameState(prev => drawFromStock(prev));
  }, []);

  const handleMove = useCallback((source: CardLocation, dest: CardLocation, cardCount?: number) => {
    setSelectedCard(null);
    const result = moveCards(gameState, source, dest, cardCount);
    if (result.valid && result.newState) {
      setGameState(result.newState);
      return true;
    }
    return false;
  }, [gameState]);

  const handleAutoMove = useCallback((card: Card, source: CardLocation) => {
    const result = autoMoveToFoundation(gameState, card, source);
    if (result.valid && result.newState) {
      setGameState(result.newState);
      return true;
    }
    return false;
  }, [gameState]);

  const handleCardClick = useCallback((card: Card, location: CardLocation) => {
    if (!card.faceUp) return;

    // If clicking the same card, deselect
    if (selectedCard && selectedCard.card.id === card.id) {
      setSelectedCard(null);
      return;
    }

    // If we have a selected card, try to move it
    if (selectedCard) {
      // Calculate how many cards to move
      let cardCount = 1;
      if (selectedCard.source.pile === "tableau") {
        const column = gameState.tableau[selectedCard.source.index];
        const startIndex = selectedCard.source.cardIndex ?? column.length - 1;
        cardCount = column.length - startIndex;
      }

      const success = handleMove(selectedCard.source, location, cardCount);
      if (success) {
        setSelectedCard(null);
        return;
      }
    }

    // Select this card
    setSelectedCard({ card, source: location });
  }, [selectedCard, handleMove, gameState.tableau]);

  const handleEmptyClick = useCallback((location: CardLocation) => {
    if (selectedCard) {
      let cardCount = 1;
      if (selectedCard.source.pile === "tableau") {
        const column = gameState.tableau[selectedCard.source.index];
        const startIndex = selectedCard.source.cardIndex ?? column.length - 1;
        cardCount = column.length - startIndex;
      }

      handleMove(selectedCard.source, location, cardCount);
      setSelectedCard(null);
    }
  }, [selectedCard, handleMove, gameState.tableau]);

  const handleNewGame = useCallback((drawCount?: 1 | 3) => {
    setSelectedCard(null);
    setIsAutoCompleting(false);
    gameStateStorage.clear();

    const newState = createNewGame(drawCount ?? gameState.drawCount);
    setGameState(newState);

    // Increment games played
    const newStats = {
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1,
    };
    setStats(newStats);
    statsStorage.save(newStats);
  }, [gameState.drawCount, stats]);

  const handleChangeDrawCount = useCallback((drawCount: 1 | 3) => {
    if (drawCount !== gameState.drawCount) {
      handleNewGame(drawCount);
    }
  }, [gameState.drawCount, handleNewGame]);

  const startAutoComplete = useCallback(() => {
    if (canAutoComplete(gameState)) {
      setIsAutoCompleting(true);
    }
  }, [gameState]);

  const clearSelection = useCallback(() => {
    setSelectedCard(null);
  }, []);

  const canAutoCompleteNow = canAutoComplete(gameState);

  return {
    gameState,
    stats,
    selectedCard,
    isAutoCompleting,
    isInitialized,
    canAutoComplete: canAutoCompleteNow,
    handleDraw,
    handleMove,
    handleAutoMove,
    handleCardClick,
    handleEmptyClick,
    handleNewGame,
    handleChangeDrawCount,
    startAutoComplete,
    clearSelection,
  };
}
