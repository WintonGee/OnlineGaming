import { Difficulty, DifficultyConfig } from './types';

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: { rows: 3, cols: 4, pairs: 6 },      // 12 cards, 6 pairs
  medium: { rows: 4, cols: 4, pairs: 8 },    // 16 cards, 8 pairs
  hard: { rows: 4, cols: 5, pairs: 10 },     // 20 cards, 10 pairs
} as const;

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
} as const;

// Card symbols - using emoji for visual appeal
export const CARD_SYMBOLS = [
  "🍎", "🍊", "🍋", "🍇", "🍓", "🍒",
  "🌟", "🌙", "☀️", "🌈", "⭐", "💫",
  "🎈", "🎁", "🎨", "🎭", "🎪", "🎯",
  "🦋", "🐝", "🌸", "🌺", "🍀", "🌻",
] as const;

export const FLIP_ANIMATION_DURATION = 300; // milliseconds
export const MATCH_CHECK_DELAY = 800; // milliseconds - time to view unmatched cards
export const MATCH_ANIMATION_DELAY = 400; // milliseconds - delay after match before continuing

export const BEST_SCORES_KEY = 'memory-best-scores';
export const GAME_STATE_KEY = 'memory-game-state';

export const DEFAULT_DIFFICULTY: Difficulty = 'medium';

export function createInitialState(difficulty: Difficulty = DEFAULT_DIFFICULTY) {
  const config = DIFFICULTY_CONFIG[difficulty];
  return {
    cards: [],
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
