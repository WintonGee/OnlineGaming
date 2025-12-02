export interface GameState {
  solution: string;
  category: string;
  guessedLetters: string[];
  incorrectGuesses: string[];
  gameOver: boolean;
  won: boolean;
}

export interface WordCategory {
  name: string;
  words: string[];
}

export interface SavedGameState {
  solution: string;
  category: string;
  guessedLetters: string[];
  incorrectGuesses: string[];
  gameOver: boolean;
  won: boolean;
}
