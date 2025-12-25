import { Card, GameState, CardLocation, MoveResult } from "../types";
import { createShuffledDeck } from "./deck";
import {
  canPlaceOnTableau,
  canPlaceOnEmptyTableau,
  canPlaceOnFoundation,
  isValidTableauSequence,
  checkWinCondition,
} from "./validation";

/**
 * Creates an empty game state for SSR hydration
 * This ensures server and client render the same initial state
 */
export function createEmptyState(drawCount: 1 | 3 = 1): GameState {
  return {
    tableau: [[], [], [], [], [], [], []],
    foundation: [[], [], [], []],
    stock: [],
    waste: [],
    moves: 0,
    gameStarted: false,
    won: false,
    drawCount,
  };
}

/**
 * Creates a new game with dealt cards
 */
export function createNewGame(drawCount: 1 | 3 = 1): GameState {
  const deck = createShuffledDeck();

  // Deal to 7 tableau columns
  // Column 0 gets 1 card, column 1 gets 2, etc.
  const tableau: Card[][] = [];
  let deckIndex = 0;

  for (let col = 0; col < 7; col++) {
    const column: Card[] = [];
    for (let row = 0; row <= col; row++) {
      const card = { ...deck[deckIndex++] };
      // Only the top card (last in column) is face up
      card.faceUp = row === col;
      column.push(card);
    }
    tableau.push(column);
  }

  // Remaining cards go to stock (face down)
  const stock = deck.slice(deckIndex).map(card => ({ ...card, faceUp: false }));

  return {
    tableau,
    foundation: [[], [], [], []], // 4 empty foundation piles
    stock,
    waste: [],
    moves: 0,
    gameStarted: false,
    won: false,
    drawCount,
  };
}

/**
 * Gets the top card of a pile, or null if empty
 */
function getTopCard(pile: Card[]): Card | null {
  return pile.length > 0 ? pile[pile.length - 1] : null;
}

/**
 * Deep clones the game state
 */
function cloneState(state: GameState): GameState {
  return {
    tableau: state.tableau.map(col => col.map(card => ({ ...card }))),
    foundation: state.foundation.map(pile => pile.map(card => ({ ...card }))),
    stock: state.stock.map(card => ({ ...card })),
    waste: state.waste.map(card => ({ ...card })),
    moves: state.moves,
    gameStarted: state.gameStarted,
    won: state.won,
    drawCount: state.drawCount,
  };
}

/**
 * Flips the top card of a tableau column if it's face down
 */
function flipTopCard(column: Card[]): void {
  if (column.length > 0 && !column[column.length - 1].faceUp) {
    column[column.length - 1].faceUp = true;
  }
}

/**
 * Draws cards from stock to waste
 */
export function drawFromStock(state: GameState): GameState {
  const newState = cloneState(state);
  newState.gameStarted = true;

  if (newState.stock.length === 0) {
    // Reset: move all waste back to stock (reversed, face down)
    newState.stock = newState.waste.reverse().map(card => ({ ...card, faceUp: false }));
    newState.waste = [];
  } else {
    // Draw cards from stock to waste
    const drawCount = Math.min(state.drawCount, newState.stock.length);
    for (let i = 0; i < drawCount; i++) {
      const card = newState.stock.pop()!;
      card.faceUp = true;
      newState.waste.push(card);
    }
  }

  return newState;
}

/**
 * Moves cards from one location to another
 */
export function moveCards(
  state: GameState,
  source: CardLocation,
  dest: CardLocation,
  cardCount: number = 1
): MoveResult {
  const newState = cloneState(state);
  newState.gameStarted = true;

  // Get source cards
  let cards: Card[];

  if (source.pile === "waste") {
    if (newState.waste.length === 0) {
      return { valid: false, message: "Waste pile is empty" };
    }
    cards = [newState.waste[newState.waste.length - 1]];
  } else if (source.pile === "tableau") {
    const column = newState.tableau[source.index];
    const startIndex = source.cardIndex ?? column.length - 1;
    cards = column.slice(startIndex);

    if (cards.length === 0 || !cards[0].faceUp) {
      return { valid: false, message: "Cannot move face-down cards" };
    }

    if (!isValidTableauSequence(cards)) {
      return { valid: false, message: "Invalid card sequence" };
    }
  } else if (source.pile === "foundation") {
    const pile = newState.foundation[source.index];
    if (pile.length === 0) {
      return { valid: false, message: "Foundation pile is empty" };
    }
    cards = [pile[pile.length - 1]];
  } else {
    return { valid: false, message: "Cannot move from stock directly" };
  }

  // Validate destination
  const movingCard = cards[0];

  if (dest.pile === "foundation") {
    if (cards.length > 1) {
      return { valid: false, message: "Can only move one card to foundation" };
    }

    const foundationPile = newState.foundation[dest.index];
    const topCard = getTopCard(foundationPile);

    if (!canPlaceOnFoundation(movingCard, topCard)) {
      return { valid: false, message: "Invalid foundation move" };
    }
  } else if (dest.pile === "tableau") {
    const column = newState.tableau[dest.index];
    const topCard = getTopCard(column);

    if (topCard === null) {
      if (!canPlaceOnEmptyTableau(movingCard)) {
        return { valid: false, message: "Only Kings can go on empty columns" };
      }
    } else {
      if (!canPlaceOnTableau(movingCard, topCard)) {
        return { valid: false, message: "Invalid tableau move" };
      }
    }
  } else {
    return { valid: false, message: "Invalid destination" };
  }

  // Perform the move
  // Remove from source
  if (source.pile === "waste") {
    newState.waste.pop();
  } else if (source.pile === "tableau") {
    const startIndex = source.cardIndex ?? newState.tableau[source.index].length - 1;
    newState.tableau[source.index] = newState.tableau[source.index].slice(0, startIndex);
    // Flip the new top card if face down
    flipTopCard(newState.tableau[source.index]);
  } else if (source.pile === "foundation") {
    newState.foundation[source.index].pop();
  }

  // Add to destination
  if (dest.pile === "foundation") {
    newState.foundation[dest.index].push(...cards);
  } else if (dest.pile === "tableau") {
    newState.tableau[dest.index].push(...cards);
  }

  newState.moves += 1;
  newState.won = checkWinCondition(newState.foundation);

  return { valid: true, newState };
}

/**
 * Auto-move a card to foundation if possible
 */
export function autoMoveToFoundation(state: GameState, card: Card, source: CardLocation): MoveResult {
  // Find which foundation pile this card can go to
  for (let i = 0; i < 4; i++) {
    const pile = state.foundation[i];
    const topCard = getTopCard(pile);

    if (canPlaceOnFoundation(card, topCard)) {
      return moveCards(state, source, { pile: "foundation", index: i });
    }
  }

  return { valid: false, message: "Cannot auto-move to foundation" };
}

/**
 * Gets all valid moves for auto-complete
 * Returns moves that can be made to foundation
 */
export function getAutoCompleteMoves(state: GameState): { source: CardLocation; card: Card }[] {
  const moves: { source: CardLocation; card: Card }[] = [];

  // Check waste pile
  if (state.waste.length > 0) {
    const card = state.waste[state.waste.length - 1];
    for (let i = 0; i < 4; i++) {
      if (canPlaceOnFoundation(card, getTopCard(state.foundation[i]))) {
        moves.push({ source: { pile: "waste", index: 0 }, card });
        break;
      }
    }
  }

  // Check tableau piles
  for (let i = 0; i < 7; i++) {
    const column = state.tableau[i];
    if (column.length > 0) {
      const card = column[column.length - 1];
      if (card.faceUp) {
        for (let j = 0; j < 4; j++) {
          if (canPlaceOnFoundation(card, getTopCard(state.foundation[j]))) {
            moves.push({ source: { pile: "tableau", index: i, cardIndex: column.length - 1 }, card });
            break;
          }
        }
      }
    }
  }

  return moves;
}

/**
 * Checks if auto-complete is available (all cards are face up)
 */
export function canAutoComplete(state: GameState): boolean {
  // Stock and waste must be empty
  if (state.stock.length > 0 || state.waste.length > 0) {
    return false;
  }

  // All tableau cards must be face up
  return state.tableau.every(column => column.every(card => card.faceUp));
}

/**
 * Performs one step of auto-complete
 */
export function autoCompleteStep(state: GameState): GameState | null {
  const moves = getAutoCompleteMoves(state);

  if (moves.length === 0) {
    return null;
  }

  const { source, card } = moves[0];
  const result = autoMoveToFoundation(state, card, source);

  return result.valid ? result.newState! : null;
}
