import { Card, Difficulty, GameState } from '../types';
import { CARD_SYMBOLS, DIFFICULTY_CONFIG } from '../constants';

/**
 * Fisher-Yates shuffle algorithm
 * Creates a new shuffled array without mutating the original
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Creates a new deck of cards for the given difficulty
 */
export function createDeck(difficulty: Difficulty): Card[] {
  const config = DIFFICULTY_CONFIG[difficulty];
  const numPairs = config.pairs;

  // Select random symbols for this game
  const shuffledSymbols = shuffle([...CARD_SYMBOLS]);
  const selectedSymbols = shuffledSymbols.slice(0, numPairs);

  // Create pairs of cards
  const cards: Card[] = [];
  let id = 0;

  for (let pairId = 0; pairId < numPairs; pairId++) {
    const symbol = selectedSymbols[pairId];
    // Create two cards with the same symbol (a pair)
    cards.push({
      id: id++,
      symbol,
      pairId,
      status: 'hidden',
    });
    cards.push({
      id: id++,
      symbol,
      pairId,
      status: 'hidden',
    });
  }

  // Shuffle the deck
  return shuffle(cards);
}

/**
 * Checks if a card can be flipped
 */
export function canFlipCard(cards: Card[], cardIndex: number, flippedCards: number[]): boolean {
  // Can't flip if already 2 cards are flipped
  if (flippedCards.length >= 2) return false;

  // Can't flip if card is already flipped or matched
  const card = cards[cardIndex];
  if (!card || card.status !== 'hidden') return false;

  // Can't flip if this card is already in flippedCards
  if (flippedCards.includes(cardIndex)) return false;

  return true;
}

/**
 * Flips a card and returns the new cards array
 */
export function flipCard(cards: Card[], cardIndex: number): Card[] {
  return cards.map((card, index) =>
    index === cardIndex ? { ...card, status: 'flipped' as const } : card
  );
}

/**
 * Checks if two flipped cards match
 */
export function checkMatch(cards: Card[], flippedCards: number[]): boolean {
  if (flippedCards.length !== 2) return false;

  const [first, second] = flippedCards;
  return cards[first].pairId === cards[second].pairId;
}

/**
 * Marks matched cards
 */
export function markAsMatched(cards: Card[], flippedCards: number[]): Card[] {
  return cards.map((card, index) =>
    flippedCards.includes(index) ? { ...card, status: 'matched' as const } : card
  );
}

/**
 * Resets flipped cards back to hidden
 */
export function resetFlippedCards(cards: Card[], flippedCards: number[]): Card[] {
  return cards.map((card, index) =>
    flippedCards.includes(index) ? { ...card, status: 'hidden' as const } : card
  );
}

/**
 * Checks if the game is won (all cards matched)
 */
export function isGameWon(cards: Card[]): boolean {
  return cards.every(card => card.status === 'matched');
}

/**
 * Counts matched pairs
 */
export function countMatchedPairs(cards: Card[]): number {
  return cards.filter(card => card.status === 'matched').length / 2;
}

/**
 * Creates a new game state
 */
export function createNewGame(difficulty: Difficulty): GameState {
  const config = DIFFICULTY_CONFIG[difficulty];
  const cards = createDeck(difficulty);

  return {
    cards,
    flippedCards: [],
    moves: 0,
    matches: 0,
    totalPairs: config.pairs,
    difficulty,
    gameStarted: false,
    gameOver: false,
    won: false,
  };
}
