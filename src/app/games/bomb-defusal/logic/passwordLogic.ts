// Password module logic for bomb defusal game

import { PasswordModuleState } from "../types";
import { PASSWORD_WORDS, PASSWORD_LETTERS_PER_COLUMN, PASSWORD_COLUMNS } from "../constants";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Get all letters that appear at a specific position across all valid words
 */
function getLettersAtPosition(position: number): Set<string> {
  const letters = new Set<string>();
  for (const word of PASSWORD_WORDS) {
    letters.add(word[position].toUpperCase());
  }
  return letters;
}

/**
 * Count how many valid words can be formed from given letter sets
 */
function countPossibleWords(letterSets: Set<string>[]): number {
  let count = 0;
  for (const word of PASSWORD_WORDS) {
    const upperWord = word.toUpperCase();
    let canForm = true;
    for (let i = 0; i < PASSWORD_COLUMNS; i++) {
      if (!letterSets[i].has(upperWord[i])) {
        canForm = false;
        break;
      }
    }
    if (canForm) count++;
  }
  return count;
}

/**
 * Shuffle an array in place
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generate safe decoy letters that won't enable other valid words
 */
function generateSafeDecoys(
  position: number,
  targetWord: string,
  currentLetterSets: Set<string>[],
  count: number
): string[] {
  const targetLetter = targetWord[position].toUpperCase();
  const validLettersAtPos = getLettersAtPosition(position);
  const decoys: string[] = [];
  const shuffledAlphabet = shuffleArray([...ALPHABET]);

  for (const letter of shuffledAlphabet) {
    if (decoys.length >= count) break;
    if (letter === targetLetter) continue;

    // Test if adding this letter would enable another valid word
    const testSets = currentLetterSets.map((set, i) => {
      if (i === position) {
        const newSet = new Set(set);
        newSet.add(letter);
        return newSet;
      }
      return set;
    });

    const possibleCount = countPossibleWords(testSets);

    // Only add if it still results in exactly 1 valid word
    if (possibleCount === 1) {
      decoys.push(letter);
    }
  }

  // Fill remaining with non-valid letters if needed
  if (decoys.length < count) {
    for (const letter of shuffledAlphabet) {
      if (decoys.length >= count) break;
      if (letter === targetLetter) continue;
      if (decoys.includes(letter)) continue;
      if (!validLettersAtPos.has(letter)) {
        decoys.push(letter);
      }
    }
  }

  return decoys;
}

/**
 * Generate letter options with exactly one valid word solution
 */
export function generateLetterOptions(): {
  columns: string[][];
  correctWord: string;
} {
  // Select random target word
  const targetIndex = Math.floor(Math.random() * PASSWORD_WORDS.length);
  const targetWord = PASSWORD_WORDS[targetIndex];
  const upperTarget = targetWord.toUpperCase();

  // Initialize with target letters
  const letterSets: Set<string>[] = [];
  for (let i = 0; i < PASSWORD_COLUMNS; i++) {
    letterSets.push(new Set([upperTarget[i]]));
  }

  // Add decoy letters for each position
  for (let position = 0; position < PASSWORD_COLUMNS; position++) {
    const decoysNeeded = PASSWORD_LETTERS_PER_COLUMN - 1;
    const decoys = generateSafeDecoys(position, targetWord, letterSets, decoysNeeded);

    for (const decoy of decoys) {
      letterSets[position].add(decoy);
    }
  }

  // Convert to arrays with randomized order
  const columns = letterSets.map((set) => shuffleArray([...set]));

  return {
    columns,
    correctWord: targetWord,
  };
}

/**
 * Get the currently displayed word
 */
export function getCurrentWord(columns: string[][], indices: number[]): string {
  return indices.map((idx, col) => columns[col][idx]).join("");
}

/**
 * Check if word is in valid word list
 */
export function isValidWord(word: string): boolean {
  return (PASSWORD_WORDS as readonly string[]).includes(word.toLowerCase());
}

/**
 * Generate Password module state
 */
export function generatePasswordModule(): PasswordModuleState {
  const { columns, correctWord } = generateLetterOptions();

  return {
    id: `password-${Date.now()}`,
    type: "password",
    status: "unsolved",
    columns,
    currentIndices: columns.map(() => Math.floor(Math.random() * PASSWORD_LETTERS_PER_COLUMN)),
    correctWord,
  };
}

/**
 * Cycle a column up (previous letter)
 */
export function cycleUp(
  state: PasswordModuleState,
  columnIndex: number
): PasswordModuleState {
  const newIndices = [...state.currentIndices];
  const columnLength = state.columns[columnIndex].length;
  newIndices[columnIndex] = (newIndices[columnIndex] - 1 + columnLength) % columnLength;

  return { ...state, currentIndices: newIndices };
}

/**
 * Cycle a column down (next letter)
 */
export function cycleDown(
  state: PasswordModuleState,
  columnIndex: number
): PasswordModuleState {
  const newIndices = [...state.currentIndices];
  const columnLength = state.columns[columnIndex].length;
  newIndices[columnIndex] = (newIndices[columnIndex] + 1) % columnLength;

  return { ...state, currentIndices: newIndices };
}

/**
 * Submit the current word
 */
export function submitPassword(
  state: PasswordModuleState
): { newState: PasswordModuleState; isCorrect: boolean } {
  const currentWord = getCurrentWord(state.columns, state.currentIndices);
  const isCorrect = currentWord.toLowerCase() === state.correctWord.toLowerCase();

  return {
    newState: {
      ...state,
      status: isCorrect ? "solved" : "strike",
    },
    isCorrect,
  };
}
