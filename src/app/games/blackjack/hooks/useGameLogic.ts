"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGameState } from "./useGameState";
import { useDialogState } from "@/lib/hooks/useDialogState";
import { DEALER_TURN_DELAY, CARD_DRAW_ANIMATION, CARD_FLIP_ANIMATION } from "../constants";
import { calculateHandScore, canHit, determineWinner } from "../logic/game";
import { drawCard } from "../logic/deck";

export function useGameLogic() {
  const { gameState, updateState, resetGame, isDealing } = useGameState();
  const [isAIThinking, setIsAIThinking] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const instructionsDialog = useDialogState();

  // Check for immediate blackjack after dealing completes
  useEffect(() => {
    if (gameState.gamePhase !== "playing" || isDealing) return;
    if (gameState.playerHand.cards.length !== 2) return;

    const playerBJ = gameState.playerHand.isBlackjack;
    const dealerCards = gameState.dealerHand.cards.map((c) => ({ ...c, faceUp: true }));
    const dealerBJ = calculateHandScore(dealerCards).isBlackjack;

    if (playerBJ || dealerBJ) {
      // Flip dealer's card with animation
      const flippingCards = gameState.dealerHand.cards.map((c, i) =>
        i === 1 ? { ...c, isFlipping: true } : c
      );
      updateState({
        dealerHand: { cards: flippingCards, ...calculateHandScore(flippingCards) },
      });

      // After flip animation, show result
      setTimeout(() => {
        const result = determineWinner(gameState.playerHand.cards, dealerCards);
        updateState({
          dealerHand: { cards: dealerCards, ...calculateHandScore(dealerCards) },
          gamePhase: "gameOver",
          gameResult: result,
        });
      }, CARD_FLIP_ANIMATION);
    }
  }, [gameState.gamePhase, isDealing]);

  const handleHit = useCallback(() => {
    if (gameState.gamePhase !== "playing" || !canHit(gameState.playerHand.cards)) return;

    const { card, remainingDeck } = drawCard(gameState.deck);
    const newCard = { ...card, isNew: true };
    const newCards = [...gameState.playerHand.cards, newCard];
    const score = calculateHandScore(newCards);

    // First, add the card with animation
    updateState({
      playerHand: { cards: newCards, ...score },
      deck: remainingDeck,
    });

    // After animation, clear isNew flag and check for bust
    setTimeout(() => {
      const clearedCards = newCards.map((c) => ({ ...c, isNew: false }));

      if (score.isBust) {
        const dealerCards = gameState.dealerHand.cards.map((c) => ({ ...c, faceUp: true }));
        updateState({
          playerHand: { cards: clearedCards, ...score },
          dealerHand: { cards: dealerCards, ...calculateHandScore(dealerCards) },
          gamePhase: "gameOver",
          gameResult: "dealerWin",
        });
      } else {
        updateState({
          playerHand: { cards: clearedCards, ...score },
        });
      }
    }, CARD_DRAW_ANIMATION);
  }, [gameState, updateState]);

  const handleStand = useCallback(() => {
    if (gameState.gamePhase !== "playing") return;

    // Flip dealer's hidden card with animation
    const flippingCards = gameState.dealerHand.cards.map((c, i) =>
      i === 1 ? { ...c, isFlipping: true } : c
    );
    updateState({
      dealerHand: { cards: flippingCards, ...calculateHandScore(flippingCards) },
      gamePhase: "dealerTurn",
    });
  }, [gameState.gamePhase, gameState.dealerHand.cards, updateState]);

  const handleNewGame = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsAIThinking(false);
    resetGame();
  }, [resetGame]);

  // Dealer turn - draw cards one by one with animation
  useEffect(() => {
    if (gameState.gamePhase !== "dealerTurn") return;

    setIsAIThinking(true);

    // First, complete the flip animation
    timeoutRef.current = setTimeout(() => {
      const revealedCards = gameState.dealerHand.cards.map((c) => ({
        ...c,
        faceUp: true,
        isFlipping: false,
      }));
      const currentScore = calculateHandScore(revealedCards);

      // If dealer needs to draw more cards
      if (currentScore.score < 17) {
        dealerDrawSequence(revealedCards, gameState.deck, currentScore.score);
      } else {
        // Dealer stands
        finishGame(revealedCards);
      }
    }, CARD_FLIP_ANIMATION);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [gameState.gamePhase]);

  const dealerDrawSequence = (
    dealerCards: typeof gameState.dealerHand.cards,
    deck: typeof gameState.deck,
    currentScore: number
  ) => {
    if (currentScore >= 17) {
      finishGame(dealerCards);
      return;
    }

    // Draw a card
    const { card, remainingDeck } = drawCard(deck);
    const newCard = { ...card, isNew: true };
    const newCards = [...dealerCards, newCard];
    const newScore = calculateHandScore(newCards);

    updateState({
      dealerHand: { cards: newCards, ...newScore },
      deck: remainingDeck,
    });

    // After animation, continue or finish
    timeoutRef.current = setTimeout(() => {
      const clearedCards = newCards.map((c) => ({ ...c, isNew: false }));
      updateState({
        dealerHand: { cards: clearedCards, ...newScore },
      });

      if (newScore.score < 17 && !newScore.isBust) {
        dealerDrawSequence(clearedCards, remainingDeck, newScore.score);
      } else {
        finishGame(clearedCards);
      }
    }, DEALER_TURN_DELAY);
  };

  const finishGame = (dealerCards: typeof gameState.dealerHand.cards) => {
    const result = determineWinner(gameState.playerHand.cards, dealerCards);
    updateState({
      dealerHand: { cards: dealerCards, ...calculateHandScore(dealerCards) },
      gamePhase: "gameOver",
      gameResult: result,
    });
    setIsAIThinking(false);
  };

  const getStatusMessage = (): string => {
    if (gameState.gamePhase === "dealing") return "Dealing...";
    if (isAIThinking) return "Dealer is playing...";
    if (gameState.gamePhase === "gameOver") {
      switch (gameState.gameResult) {
        case "blackjack":
          return "Blackjack! You win!";
        case "playerWin":
          return "You win!";
        case "dealerWin":
          return gameState.playerHand.isBust ? "Bust! Dealer wins." : "Dealer wins!";
        case "push":
          return "Push - It's a tie!";
        default:
          return "";
      }
    }
    return "Hit or Stand?";
  };

  return {
    gameState,
    isAIThinking: isAIThinking || isDealing,
    statusMessage: getStatusMessage(),
    handleHit,
    handleStand,
    handleNewGame,
    instructionsDialog,
  };
}
