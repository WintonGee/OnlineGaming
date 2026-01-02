/**
 * Validation helper functions for Typing Test
 * Pure functions for input validation
 */

import { GameState } from "../types";

/**
 * Maximum extra characters allowed beyond the word length
 * Prevents unlimited typing on a single word
 */
const MAX_EXTRA_CHARS = 10;

/**
 * Validate if current word can accept more characters
 * Returns false if the word has too many extra characters
 */
export function canAddCharacter(state: GameState): boolean {
  const { words, currentWordIndex, currentCharIndex, isComplete } = state;

  // Can't add if test is complete
  if (isComplete) {
    return false;
  }

  const currentWord = words[currentWordIndex];

  // Can't add if no current word (shouldn't happen normally)
  if (!currentWord) {
    return false;
  }

  // Check if we've exceeded max extra characters
  const extraChars = currentCharIndex - currentWord.word.length;
  if (extraChars >= MAX_EXTRA_CHARS) {
    return false;
  }

  return true;
}

/**
 * Check if the typed character matches the expected character
 * Case-sensitive comparison
 */
export function isCharacterCorrect(expected: string, typed: string): boolean {
  return expected === typed;
}

/**
 * Get the expected character at the current position
 * Returns null if beyond word length or no current word
 */
export function getExpectedCharacter(state: GameState): string | null {
  const { words, currentWordIndex, currentCharIndex } = state;

  const currentWord = words[currentWordIndex];

  // No current word
  if (!currentWord) {
    return null;
  }

  // Beyond word length (extra character territory)
  if (currentCharIndex >= currentWord.word.length) {
    return null;
  }

  return currentWord.word[currentCharIndex];
}

/**
 * Check if the current word is fully typed (no more expected characters)
 */
export function isWordFullyTyped(state: GameState): boolean {
  const { words, currentWordIndex, currentCharIndex } = state;

  const currentWord = words[currentWordIndex];

  if (!currentWord) {
    return false;
  }

  return currentCharIndex >= currentWord.word.length;
}

/**
 * Check if a character is a valid typing character
 * Only allows printable ASCII characters
 */
export function isValidTypingCharacter(char: string): boolean {
  // Single character only
  if (char.length !== 1) {
    return false;
  }

  const code = char.charCodeAt(0);

  // Printable ASCII characters (space through tilde)
  return code >= 32 && code <= 126;
}

/**
 * Check if the test can be started
 * Returns true if the test is not already active or complete
 */
export function canStartTest(state: GameState): boolean {
  return !state.isActive && !state.isComplete;
}

/**
 * Check if the test can be reset
 * Always returns true since test can be reset at any time
 */
export function canResetTest(): boolean {
  return true;
}
