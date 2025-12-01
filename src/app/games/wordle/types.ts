export type LetterStatus = "correct" | "present" | "absent" | "unused";

export type GameMode = "daily" | "random";

export interface Letter {
  char: string;
  status: LetterStatus;
}

export interface Guess {
  word: string;
  letters: Letter[];
}

export interface GameState {
  currentGuess: string;
  guesses: Guess[];
  solution: string;
  gameOver: boolean;
  won: boolean;
  attempt: number;
  mode: GameMode;
}

export interface SavedGameState {
  currentGuess: string;
  guesses: Guess[];
  solution: string;
  gameOver: boolean;
  won: boolean;
  attempt: number;
  mode?: GameMode; // Optional for backward compatibility
  hardMode?: boolean; // Optional for backward compatibility
  startTime?: number | null; // Optional for backward compatibility
  endTime?: number | null; // Optional for backward compatibility
  wordLength?: number; // Optional for backward compatibility
}

export interface KeyboardKey {
  key: string;
  status: LetterStatus;
}

export interface DailyState {
  date: string; // YYYY-MM-DD format
  guesses: Guess[];
  solution: string;
  won: boolean;
  completed: boolean;
}
