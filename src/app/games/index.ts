import { GameConfig } from "@/lib/types";
import { sudokuConfig } from "./sudoku/config";
import { game2048Config } from "./2048/config";
import { minesweeperConfig } from "./minesweeper/config";
import { wordleConfig } from "./wordle/config";
import { hangmanConfig } from "./hangman/config";
import { ticTacToeConfig } from "./tic-tac-toe/config";
import { dotsAndBoxesConfig } from "./dots-and-boxes/config";
import { connectFourConfig } from "./connect-four/config";
import { memoryConfig } from "./memory/config";
import { slidingPuzzleConfig } from "./sliding-puzzle/config";
import { snakeConfig } from "./snake/config";
import { wordSearchConfig } from "./word-search/config";
import { blackjackConfig } from "./blackjack/config";
import { mastermindConfig } from "./mastermind/config";
import { bombDefusalConfig } from "./bomb-defusal/config";
import { solitaireConfig } from "./solitaire/config";
import { reactionTimerConfig } from "./reaction-timer/config";

export const allGames: GameConfig[] = [
  sudokuConfig,
  game2048Config,
  minesweeperConfig,
  wordleConfig,
  hangmanConfig,
  ticTacToeConfig,
  dotsAndBoxesConfig,
  connectFourConfig,
  memoryConfig,
  slidingPuzzleConfig,
  snakeConfig,
  wordSearchConfig,
  blackjackConfig,
  mastermindConfig,
  bombDefusalConfig,
  solitaireConfig,
  reactionTimerConfig,
];
