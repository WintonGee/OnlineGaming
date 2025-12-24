"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { GameState, Hand, Card } from "../types";
import { createDeck, shuffleDeck, dealInitialCards } from "../logic/deck";
import { calculateHandScore } from "../logic/game";
import { CARD_DRAW_ANIMATION, INITIAL_DEAL_DELAY } from "../constants";

function createEmptyState(deck: Card[]): GameState {
  return {
    playerHand: { cards: [], score: 0, isBust: false, isBlackjack: false },
    dealerHand: { cards: [], score: 0, isBust: false, isBlackjack: false },
    deck,
    gamePhase: "dealing",
    gameResult: null,
  };
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const deck = shuffleDeck(createDeck());
    return createEmptyState(deck);
  });
  const [isDealing, setIsDealing] = useState(true);
  const dealingRef = useRef(false);

  // Animated initial deal
  useEffect(() => {
    if (!isDealing || dealingRef.current) return;
    dealingRef.current = true;

    const deck = shuffleDeck(createDeck());
    const { playerHand, dealerHand, remainingDeck } = dealInitialCards(deck);

    // Deal cards one by one with animation
    const dealSequence = [
      { target: "player", card: playerHand[0] },
      { target: "dealer", card: dealerHand[0] },
      { target: "player", card: playerHand[1] },
      { target: "dealer", card: dealerHand[1] },
    ];

    let currentIndex = 0;

    const dealNextCard = () => {
      if (currentIndex >= dealSequence.length) {
        // Dealing complete - clear isNew flags after animation
        setTimeout(() => {
          setGameState((prev) => ({
            ...prev,
            playerHand: {
              cards: prev.playerHand.cards.map((c) => ({ ...c, isNew: false })),
              ...calculateHandScore(prev.playerHand.cards),
            },
            dealerHand: {
              cards: prev.dealerHand.cards.map((c) => ({ ...c, isNew: false })),
              ...calculateHandScore(prev.dealerHand.cards),
            },
            gamePhase: "playing",
          }));
          setIsDealing(false);
          dealingRef.current = false;
        }, CARD_DRAW_ANIMATION);
        return;
      }

      const { target, card } = dealSequence[currentIndex];
      const newCard = { ...card, isNew: true };

      setGameState((prev) => {
        if (target === "player") {
          const newCards = [...prev.playerHand.cards, newCard];
          return {
            ...prev,
            playerHand: { cards: newCards, ...calculateHandScore(newCards) },
            deck: remainingDeck,
          };
        } else {
          const newCards = [...prev.dealerHand.cards, newCard];
          return {
            ...prev,
            dealerHand: { cards: newCards, ...calculateHandScore(newCards) },
            deck: remainingDeck,
          };
        }
      });

      currentIndex++;
      setTimeout(dealNextCard, INITIAL_DEAL_DELAY);
    };

    // Start dealing after a small delay
    setTimeout(dealNextCard, 100);
  }, [isDealing]);

  const updateState = useCallback((updates: Partial<GameState>) => {
    setGameState((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetGame = useCallback(() => {
    const deck = shuffleDeck(createDeck());
    setGameState(createEmptyState(deck));
    dealingRef.current = false;
    setIsDealing(true);
  }, []);

  return { gameState, updateState, resetGame, isDealing };
}
