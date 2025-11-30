// Official Wordle word lists (5-letter words only)
import solutions from "../data/words/solutions.json";
import validGuesses from "../data/words/valid.json";

// Create Set for O(1) lookup of valid guesses
const validGuessSet = new Set(validGuesses.map((w: string) => w.toLowerCase()));

/**
 * Seeded random number generator using mulberry32 algorithm
 * This ensures the same seed always produces the same sequence
 */
function seededRandom(seed: number): number {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/**
 * Get seed from current date (YYYYMMDD format)
 * This ensures the same word is returned for the same day
 */
function getDailySeed(): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return parseInt(`${year}${month}${day}`, 10);
}

/**
 * Check if a word is valid for guessing
 */
export function isValidWord(word: string): boolean {
  return validGuessSet.has(word.toLowerCase());
}

/**
 * Get a random solution word (5-letter words only)
 * @param useDaily - If true, uses date-based seed for consistent daily word
 */
export function getRandomSolution(useDaily: boolean = false): string {
  if (!solutions || solutions.length === 0) {
    throw new Error("No solution words available");
  }

  let index: number;
  if (useDaily) {
    // Use seeded random based on current date
    const seed = getDailySeed();
    const randomValue = seededRandom(seed);
    index = Math.floor(randomValue * solutions.length);
  } else {
    // Use true random
    index = Math.floor(Math.random() * solutions.length);
  }

  return solutions[index].toUpperCase();
}

/**
 * Get total number of solution words
 */
export function getSolutionWordCount(): number {
  return solutions.length;
}

/**
 * Get total number of valid guess words
 */
export function getValidWordCount(): number {
  return validGuesses.length;
}
