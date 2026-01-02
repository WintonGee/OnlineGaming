// Test mode types
export type TestMode = "time" | "words";
export type TimeOption = 15 | 30 | 60 | 120;
export type WordCountOption = 10 | 25 | 50 | 100;

// Character status for visual feedback
export type CharacterStatus = "correct" | "incorrect" | "extra" | "pending";

// Individual character state
export interface CharacterState {
  char: string;
  status: CharacterStatus;
  typed?: string; // What the user actually typed (for extra chars)
}

// Word state with character breakdown
export interface WordState {
  word: string;
  characters: CharacterState[];
  isCompleted: boolean;
  isCorrect: boolean;
}

// Test configuration
export interface TestConfig {
  mode: TestMode;
  timeLimit: TimeOption; // seconds for time mode
  wordCount: WordCountOption; // words for words mode
}

// Real-time statistics
export interface TestStats {
  wpm: number; // Words per minute (standard: chars / 5 / minutes)
  rawWpm: number; // Raw WPM including errors
  accuracy: number; // Percentage 0-100
  correctChars: number;
  incorrectChars: number;
  extraChars: number;
  missedChars: number;
  totalChars: number;
  correctWords: number;
  incorrectWords: number;
  consistency: number; // Variance-based consistency score
}

// Main game state
export interface GameState {
  // Test configuration
  config: TestConfig;

  // Word data
  words: WordState[];
  currentWordIndex: number;
  currentCharIndex: number;

  // Timing
  startTime: number | null;
  endTime: number | null;
  elapsedTime: number; // in seconds

  // Status
  isActive: boolean;
  isComplete: boolean;

  // Stats
  stats: TestStats;

  // For consistency calculation - track WPM samples
  wpmHistory: number[];
}

// Result for saving personal bests
export interface TestResult {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  correctChars: number;
  incorrectChars: number;
  mode: TestMode;
  timeLimit?: TimeOption;
  wordCount?: WordCountOption;
  timestamp: number;
}

// Personal bests storage structure
export interface PersonalBests {
  time: {
    [key in TimeOption]?: TestResult;
  };
  words: {
    [key in WordCountOption]?: TestResult;
  };
}

// Saved state for session persistence
export interface SavedGameState {
  config: TestConfig;
  personalBests: PersonalBests;
}
