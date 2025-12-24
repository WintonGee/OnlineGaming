import { PegColor, FeedbackPeg } from "../types";
import { COLORS, CODE_LENGTH } from "../constants";

/**
 * Generate a random secret code
 */
export function generateSecretCode(): PegColor[] {
  const code: PegColor[] = [];
  for (let i = 0; i < CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * COLORS.length);
    code.push(COLORS[randomIndex]);
  }
  return code;
}

/**
 * Check a guess against the secret code and return feedback
 * Returns an array of feedback pegs:
 * - "correct" (black peg): right color in right position
 * - "wrongPosition" (white peg): right color in wrong position
 * - "empty": neither
 *
 * Feedback is sorted: correct pegs first, then wrongPosition, then empty
 */
export function checkGuess(guess: PegColor[], secretCode: PegColor[]): FeedbackPeg[] {
  const feedback: FeedbackPeg[] = [];

  // Track which positions in the secret code have been matched
  const secretUsed = new Array(CODE_LENGTH).fill(false);
  const guessUsed = new Array(CODE_LENGTH).fill(false);

  // First pass: find exact matches (correct position and color)
  for (let i = 0; i < CODE_LENGTH; i++) {
    if (guess[i] === secretCode[i]) {
      feedback.push("correct");
      secretUsed[i] = true;
      guessUsed[i] = true;
    }
  }

  // Second pass: find color matches in wrong positions
  for (let i = 0; i < CODE_LENGTH; i++) {
    if (guessUsed[i]) continue;

    for (let j = 0; j < CODE_LENGTH; j++) {
      if (secretUsed[j]) continue;

      if (guess[i] === secretCode[j]) {
        feedback.push("wrongPosition");
        secretUsed[j] = true;
        break;
      }
    }
  }

  // Fill remaining slots with empty
  while (feedback.length < CODE_LENGTH) {
    feedback.push("empty");
  }

  return feedback;
}

/**
 * Check if a guess is complete (all slots filled)
 */
export function isGuessComplete(guess: (PegColor | null)[]): guess is PegColor[] {
  return guess.every((peg) => peg !== null);
}

/**
 * Check if the guess matches the secret code exactly
 */
export function isWinningGuess(guess: PegColor[], secretCode: PegColor[]): boolean {
  return guess.every((peg, index) => peg === secretCode[index]);
}
