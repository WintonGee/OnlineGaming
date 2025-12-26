import { Difficulty, DifficultyConfig, CustomSettings } from './types';
import { DIFFICULTY_LABELS as SHARED_DIFFICULTY_LABELS } from "@/lib/constants/difficulty";

// Preset difficulty configurations
export const DIFFICULTY_CONFIG: Record<Exclude<Difficulty, "custom">, DifficultyConfig> = {
  easy: { rows: 3, cols: 4, pairs: 6 },      // 12 cards, 6 pairs
  medium: { rows: 4, cols: 4, pairs: 8 },    // 16 cards, 8 pairs
  hard: { rows: 4, cols: 5, pairs: 10 },     // 20 cards, 10 pairs
} as const;

// Extended labels including custom
export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  ...SHARED_DIFFICULTY_LABELS,
  custom: "Custom",
} as const;

// Constraints for custom mode
export const CUSTOM_CONSTRAINTS = {
  minRows: 2,
  maxRows: 12,
  minCols: 2,
  maxCols: 12,
  minPairs: 2,
  maxPairs: 72, // 12x12 = 144 cards = 72 pairs
} as const;

// Card symbols - extensive collection for extreme sizes (up to 72 pairs)
export const CARD_SYMBOLS = [
  // Fruits (12)
  "🍎", "🍊", "🍋", "🍇", "🍓", "🍒", "🍑", "🍌", "🥝", "🍍", "🥭", "🍈",
  // Celestial (12)
  "🌟", "🌙", "☀️", "🌈", "⭐", "💫", "🌎", "🪐", "☄️", "🌕", "✨", "🌞",
  // Party (12)
  "🎈", "🎁", "🎨", "🎭", "🎪", "🎯", "🎊", "🎉", "🎀", "🎵", "🎺", "🎸",
  // Nature (12)
  "🦋", "🐝", "🌸", "🌺", "🍀", "🌻", "🌹", "🌷", "🌵", "🌴", "🌲", "🍂",
  // Animals (12)
  "🦊", "🐼", "🦁", "🐯", "🐨", "🐸", "🦄", "🐙", "🦀", "🐢", "🦜", "🐬",
  // Food (12)
  "🍕", "🍔", "🌮", "🍦", "🧁", "🍪", "🥐", "🥨", "🍩", "🎂", "🍫", "🍿",
  // Sports (12)
  "⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🎱", "🏓", "🥊", "🎿", "🏆", "🥇",
  // Objects (12)
  "💎", "🔮", "🎩", "👑", "💡", "🔔", "🎀", "🗝️", "⏰", "📷", "🎮", "🚀",
] as const;

export const FLIP_ANIMATION_DURATION = 300; // milliseconds
export const MATCH_CHECK_DELAY = 800; // milliseconds - time to view unmatched cards
export const MATCH_ANIMATION_DELAY = 400; // milliseconds - delay after match before continuing

export const BEST_SCORES_KEY = 'memory-best-scores';
export const GAME_STATE_KEY = 'memory-game-state';
export const CUSTOM_SETTINGS_KEY = 'memory-custom-settings';

export const DEFAULT_DIFFICULTY: Difficulty = 'medium';

// Get config for any difficulty including custom
export function getConfigForDifficulty(
  difficulty: Difficulty,
  customSettings?: CustomSettings
): DifficultyConfig {
  if (difficulty === 'custom' && customSettings) {
    const totalCards = customSettings.rows * customSettings.cols;
    const pairs = Math.floor(totalCards / 2);
    return {
      rows: customSettings.rows,
      cols: customSettings.cols,
      pairs,
    };
  }
  return DIFFICULTY_CONFIG[difficulty as Exclude<Difficulty, "custom">];
}

// Validate custom settings
export function validateCustomSettings(
  rows: number,
  cols: number
): { valid: boolean; error?: string } {
  if (isNaN(rows) || isNaN(cols)) {
    return { valid: false, error: "Please enter valid numbers" };
  }
  if (rows < CUSTOM_CONSTRAINTS.minRows || rows > CUSTOM_CONSTRAINTS.maxRows) {
    return { valid: false, error: `Rows must be between ${CUSTOM_CONSTRAINTS.minRows} and ${CUSTOM_CONSTRAINTS.maxRows}` };
  }
  if (cols < CUSTOM_CONSTRAINTS.minCols || cols > CUSTOM_CONSTRAINTS.maxCols) {
    return { valid: false, error: `Columns must be between ${CUSTOM_CONSTRAINTS.minCols} and ${CUSTOM_CONSTRAINTS.maxCols}` };
  }
  const totalCards = rows * cols;
  if (totalCards % 2 !== 0) {
    return { valid: false, error: "Total cards must be even (rows × cols)" };
  }
  const pairs = totalCards / 2;
  if (pairs > CARD_SYMBOLS.length) {
    return { valid: false, error: `Maximum ${CARD_SYMBOLS.length} pairs supported (${CARD_SYMBOLS.length * 2} cards)` };
  }
  return { valid: true };
}

export function createInitialState(difficulty: Difficulty = DEFAULT_DIFFICULTY, customSettings?: CustomSettings) {
  const config = getConfigForDifficulty(difficulty, customSettings);
  return {
    cards: [],
    flippedCards: [],
    moves: 0,
    matches: 0,
    totalPairs: config.pairs,
    difficulty,
    customSettings,
    gameStarted: false,
    gameOver: false,
    won: false,
  };
}
