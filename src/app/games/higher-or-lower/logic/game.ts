import { Card, GameState, GuessResult } from "../types";
import { createDeck, shuffleDeck, drawCard } from "./deck";

export function createNewGame(): GameState {
  const deck = shuffleDeck(createDeck());
  const { card: currentCard, remainingDeck: deckAfterFirst } = drawCard(deck);
  const { card: nextCard, remainingDeck } = drawCard(deckAfterFirst);

  return {
    currentCard,
    nextCard,
    deck: remainingDeck,
    streak: 0,
    bestStreak: 0,
    gamePhase: "playing",
    lastGuess: null,
    lastResult: null,
  };
}

export function compareCards(current: Card, next: Card, guess: "higher" | "lower"): GuessResult {
  if (current.value === next.value) {
    return "tie"; // Tie counts as correct
  }

  const isHigher = next.value > current.value;

  if ((guess === "higher" && isHigher) || (guess === "lower" && !isHigher)) {
    return "correct";
  }

  return "wrong";
}

export function processGuess(
  state: GameState,
  guess: "higher" | "lower"
): GameState {
  if (!state.nextCard || state.gamePhase !== "playing") {
    return state;
  }

  const result = compareCards(state.currentCard, state.nextCard, guess);

  return {
    ...state,
    lastGuess: guess,
    lastResult: result,
    gamePhase: "revealing",
  };
}

export function advanceGame(state: GameState): GameState {
  if (state.gamePhase !== "revealing" || !state.nextCard) {
    return state;
  }

  const isCorrect = state.lastResult === "correct" || state.lastResult === "tie";

  if (!isCorrect) {
    // Game over
    return {
      ...state,
      gamePhase: "gameOver",
      bestStreak: Math.max(state.bestStreak, state.streak),
    };
  }

  // Continue game - draw new card
  const newStreak = state.streak + 1;

  // Check if deck is empty - if so, reshuffle
  if (state.deck.length === 0) {
    const newDeck = shuffleDeck(createDeck());
    const { card: newNextCard, remainingDeck } = drawCard(newDeck);

    return {
      ...state,
      currentCard: state.nextCard,
      nextCard: newNextCard,
      deck: remainingDeck,
      streak: newStreak,
      bestStreak: Math.max(state.bestStreak, newStreak),
      gamePhase: "playing",
      lastGuess: null,
      lastResult: null,
    };
  }

  const { card: newNextCard, remainingDeck } = drawCard(state.deck);

  return {
    ...state,
    currentCard: state.nextCard,
    nextCard: newNextCard,
    deck: remainingDeck,
    streak: newStreak,
    bestStreak: Math.max(state.bestStreak, newStreak),
    gamePhase: "playing",
    lastGuess: null,
    lastResult: null,
  };
}
