import { Guess, Letter, LetterStatus } from "../types";
import { isValidWord } from "./wordList";

/**
 * Check a guess against the solution and return letter statuses
 */
export function checkGuess(guess: string, solution: string): Letter[] {
  const guessUpper = guess.toUpperCase();
  const solutionUpper = solution.toUpperCase();
  const result: Letter[] = [];

  // Create frequency map of letters in solution
  const solutionLetterCount = new Map<string, number>();
  for (const char of solutionUpper) {
    solutionLetterCount.set(char, (solutionLetterCount.get(char) || 0) + 1);
  }

  // First pass: mark correct letters (green)
  for (let i = 0; i < guessUpper.length; i++) {
    if (guessUpper[i] === solutionUpper[i]) {
      result.push({ char: guessUpper[i], status: "correct" });
      // Decrement the count for this letter
      solutionLetterCount.set(
        guessUpper[i],
        (solutionLetterCount.get(guessUpper[i]) || 0) - 1
      );
    } else {
      // Placeholder for second pass
      result.push({ char: guessUpper[i], status: "absent" });
    }
  }

  // Second pass: mark present letters (yellow)
  for (let i = 0; i < guessUpper.length; i++) {
    if (result[i].status === "absent") {
      const char = guessUpper[i];
      const count = solutionLetterCount.get(char) || 0;

      if (count > 0) {
        result[i].status = "present";
        solutionLetterCount.set(char, count - 1);
      }
    }
  }

  return result;
}

/**
 * Validate that a guess meets the requirements
 */
export function validateGuess(guess: string): { valid: boolean; error?: string } {
  if (guess.length !== 5) {
    return { valid: false, error: "Word must be 5 letters" };
  }

  if (!isValidWord(guess)) {
    return { valid: false, error: "Not in word list" };
  }

  return { valid: true };
}

/**
 * Check if a guess satisfies hard mode requirements
 * Hard mode requires using all revealed hints (green and yellow letters)
 */
export function validateHardMode(
  guess: string,
  previousGuesses: Guess[]
): { valid: boolean; error?: string } {
  if (previousGuesses.length === 0) {
    return { valid: true };
  }

  const guessUpper = guess.toUpperCase();
  const revealedLetters = new Map<string, Set<number>>(); // letter -> positions where it must appear
  const mustContain = new Set<string>(); // letters that must be in the word

  // Collect all revealed information from previous guesses
  for (const prevGuess of previousGuesses) {
    for (let i = 0; i < prevGuess.letters.length; i++) {
      const { char, status } = prevGuess.letters[i];

      if (status === "correct") {
        // Green letters must be in the exact same position
        if (!revealedLetters.has(char)) {
          revealedLetters.set(char, new Set());
        }
        revealedLetters.get(char)!.add(i);
      } else if (status === "present") {
        // Yellow letters must be included somewhere in the word
        mustContain.add(char);
      }
    }
  }

  // Validate green letters (correct position)
  const revealedLettersArray = Array.from(revealedLetters.entries());
  for (let i = 0; i < revealedLettersArray.length; i++) {
    const [letter, positions] = revealedLettersArray[i];
    const positionsArray = Array.from(positions);
    for (let j = 0; j < positionsArray.length; j++) {
      const pos = positionsArray[j];
      if (guessUpper[pos] !== letter) {
        return {
          valid: false,
          error: `Must use ${letter} in position ${pos + 1}`,
        };
      }
    }
  }

  // Validate yellow letters (must contain)
  const mustContainArray = Array.from(mustContain);
  for (let i = 0; i < mustContainArray.length; i++) {
    const letter = mustContainArray[i];
    if (!guessUpper.includes(letter)) {
      return {
        valid: false,
        error: `Must contain ${letter}`,
      };
    }
  }

  return { valid: true };
}

/**
 * Check if the game is won
 */
export function isWinningGuess(guess: string, solution: string): boolean {
  return guess.toUpperCase() === solution.toUpperCase();
}

/**
 * Get keyboard key statuses from all guesses
 */
export function getKeyboardStatuses(guesses: Guess[]): Map<string, LetterStatus> {
  const statuses = new Map<string, LetterStatus>();

  for (const guess of guesses) {
    for (const letter of guess.letters) {
      const currentStatus: LetterStatus | undefined = statuses.get(letter.char);

      // Priority: correct > present > absent > unused
      if (currentStatus === "correct") {
        continue; // Already marked as correct, can't change
      }

      if (letter.status === "correct") {
        statuses.set(letter.char, "correct");
      } else if (letter.status === "present" && currentStatus !== "present") {
        statuses.set(letter.char, "present");
      } else if (letter.status === "absent") {
        if (currentStatus === undefined || currentStatus === "unused") {
          statuses.set(letter.char, "absent");
        }
      }
    }
  }

  return statuses;
}
