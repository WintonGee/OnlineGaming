export type PegColor = "red" | "blue" | "green" | "yellow" | "orange" | "purple";

export type FeedbackPeg = "correct" | "wrongPosition" | "empty";

export interface Guess {
  pegs: PegColor[];
  feedback: FeedbackPeg[];
}

export interface GameState {
  secretCode: PegColor[];
  currentGuess: (PegColor | null)[];
  guesses: Guess[];
  gameOver: boolean;
  won: boolean;
  selectedSlot: number;
}

export interface SavedGameState {
  secretCode: PegColor[];
  currentGuess: (PegColor | null)[];
  guesses: Guess[];
  gameOver: boolean;
  won: boolean;
  selectedSlot: number;
}
