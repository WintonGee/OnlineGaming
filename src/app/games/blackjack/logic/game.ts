import { Card, GameResult } from "../types";
import { CARD_VALUES, BLACKJACK_VALUE } from "../constants";

export function getCardValue(card: Card): number {
  return CARD_VALUES[card.rank];
}

export function calculateHandScore(cards: Card[]): {
  score: number;
  isBust: boolean;
  isBlackjack: boolean;
} {
  let score = 0;
  let aces = 0;

  for (const card of cards) {
    if (!card.faceUp) continue;
    const value = getCardValue(card);
    score += value;
    if (card.rank === "A") aces++;
  }

  // Convert aces from 11 to 1 if busting
  while (score > BLACKJACK_VALUE && aces > 0) {
    score -= 10;
    aces--;
  }

  return {
    score,
    isBust: score > BLACKJACK_VALUE,
    isBlackjack: score === BLACKJACK_VALUE && cards.length === 2,
  };
}

export function canHit(cards: Card[]): boolean {
  const { score, isBust } = calculateHandScore(cards);
  return !isBust && score < BLACKJACK_VALUE;
}

export function determineWinner(playerCards: Card[], dealerCards: Card[]): GameResult {
  const playerScore = calculateHandScore(playerCards);
  const dealerScore = calculateHandScore(dealerCards);

  if (playerScore.isBust) {
    return "dealerWin";
  }

  if (playerScore.isBlackjack && !dealerScore.isBlackjack) {
    return "blackjack";
  }

  if (dealerScore.isBust) {
    return "playerWin";
  }

  if (playerScore.isBlackjack && dealerScore.isBlackjack) {
    return "push";
  }

  if (playerScore.score > dealerScore.score) {
    return "playerWin";
  } else if (dealerScore.score > playerScore.score) {
    return "dealerWin";
  } else {
    return "push";
  }
}
