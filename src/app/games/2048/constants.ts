// Game configuration constants for 2048

export const GRID_SIZE = 4;
export const WINNING_TILE_VALUE = 2048;

// Probability for spawning tiles (90% = 2, 10% = 4)
export const SPAWN_VALUE_2_PROBABILITY = 0.9;

// Animation durations in milliseconds
export const TILE_MOVE_DURATION = 300;
export const TILE_MERGE_DURATION = 300;
export const NEW_TILE_DELAY = TILE_MOVE_DURATION + 50;

// Local storage keys
export const BEST_SCORE_KEY = "2048-best-score";
export const GAME_STATE_KEY = "2048-game-state";

// Swipe gesture thresholds
export const SWIPE_THRESHOLD = 50; // minimum distance in pixels
export const SWIPE_VELOCITY_THRESHOLD = 0.3; // minimum velocity
