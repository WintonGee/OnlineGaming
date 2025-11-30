export type LetterStatus = "correct" | "present" | "absent" | "unused";

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
}

export interface SavedGameState {
  currentGuess: string;
  guesses: Guess[];
  solution: string;
  gameOver: boolean;
  won: boolean;
  attempt: number;
  hardMode?: boolean; // Optional for backward compatibility
  startTime?: number | null; // Optional for backward compatibility
  endTime?: number | null; // Optional for backward compatibility
  wordLength?: number; // Optional for backward compatibility
}

export interface KeyboardKey {
  key: string;
  status: LetterStatus;
}
