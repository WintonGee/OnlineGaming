/**
 * Pure game logic functions for Typing Test
 * No React dependencies - just pure functions
 */

import {
  GameState,
  WordState,
  CharacterState,
  TestConfig,
  TestStats,
  CharacterStatus,
} from "../types";
import { getRandomWords, getWordCount, WORD_LENGTH_STANDARD } from "../constants";

/**
 * Create initial game state with default stats
 */
function createInitialStats(): TestStats {
  return {
    wpm: 0,
    rawWpm: 0,
    accuracy: 100,
    correctChars: 0,
    incorrectChars: 0,
    extraChars: 0,
    missedChars: 0,
    totalChars: 0,
    correctWords: 0,
    incorrectWords: 0,
    consistency: 100,
  };
}

/**
 * Create a new game state with the given configuration
 */
export function createNewGame(config: TestConfig): GameState {
  const wordCount = getWordCount(config);
  const words = initializeWords(wordCount);

  return {
    config,
    words,
    currentWordIndex: 0,
    currentCharIndex: 0,
    startTime: null,
    endTime: null,
    elapsedTime: 0,
    isActive: false,
    isComplete: false,
    stats: createInitialStats(),
    wpmHistory: [],
  };
}

/**
 * Initialize words with pending character states
 */
export function initializeWords(count: number): WordState[] {
  const randomWords = getRandomWords(count);

  return randomWords.map((word) => ({
    word,
    characters: word.split("").map((char) => ({
      char,
      status: "pending" as CharacterStatus,
    })),
    isCompleted: false,
    isCorrect: false,
  }));
}

/**
 * Process a character input and update state
 */
export function processCharacter(state: GameState, char: string): GameState {
  // Don't process if test is complete
  if (state.isComplete) {
    return state;
  }

  const { words, currentWordIndex, currentCharIndex } = state;
  const currentWord = words[currentWordIndex];

  if (!currentWord) {
    return state;
  }

  // Start the timer on first character if not already started
  const startTime = state.startTime ?? Date.now();
  const isActive = true;

  // Handle space (move to next word)
  if (char === " ") {
    return handleSpace(state, startTime, isActive);
  }

  // Create new words array with updated character
  const newWords = [...words];
  const newWord = { ...currentWord };
  const newCharacters = [...newWord.characters];

  // Check if we're typing beyond the word length (extra characters)
  if (currentCharIndex >= currentWord.word.length) {
    // Add an extra character
    const newChar: CharacterState = {
      char: "",
      status: "extra",
      typed: char,
    };
    newCharacters.push(newChar);
  } else {
    // Update existing character
    const expectedChar = currentWord.word[currentCharIndex];
    const isCorrect = char === expectedChar;
    newCharacters[currentCharIndex] = {
      ...newCharacters[currentCharIndex],
      status: isCorrect ? "correct" : "incorrect",
      typed: char,
    };
  }

  newWord.characters = newCharacters;
  newWords[currentWordIndex] = newWord;

  const newState: GameState = {
    ...state,
    words: newWords,
    currentCharIndex: currentCharIndex + 1,
    startTime,
    isActive,
  };

  // Recalculate stats
  return {
    ...newState,
    stats: calculateStats(newState),
  };
}

/**
 * Handle space key - move to next word
 */
function handleSpace(
  state: GameState,
  startTime: number,
  isActive: boolean
): GameState {
  const { words, currentWordIndex, currentCharIndex } = state;
  const currentWord = words[currentWordIndex];

  // Don't allow moving to next word if we haven't typed anything
  if (currentCharIndex === 0) {
    return state;
  }

  // Mark current word as completed
  const newWords = [...words];
  const newWord = { ...currentWord };
  const newCharacters = [...newWord.characters];

  // Mark any remaining untyped characters as pending (they're missed)
  // The isCorrect calculation will handle counting them
  newWord.characters = newCharacters;
  newWord.isCompleted = true;

  // Word is correct only if all characters are correct and no extras
  const hasExtras = newCharacters.some((c) => c.status === "extra");
  const allCorrect = newCharacters
    .filter((c) => c.status !== "extra")
    .slice(0, currentWord.word.length)
    .every((c) => c.status === "correct");
  const allTyped = currentCharIndex >= currentWord.word.length;
  newWord.isCorrect = allCorrect && allTyped && !hasExtras;

  newWords[currentWordIndex] = newWord;

  // Move to next word
  const nextWordIndex = currentWordIndex + 1;

  // Check if we've completed all words in words mode
  const isComplete =
    state.config.mode === "words" && nextWordIndex >= words.length;

  const newState: GameState = {
    ...state,
    words: newWords,
    currentWordIndex: nextWordIndex,
    currentCharIndex: 0,
    startTime,
    isActive,
    isComplete,
    endTime: isComplete ? Date.now() : null,
  };

  return {
    ...newState,
    stats: calculateStats(newState),
  };
}

/**
 * Handle backspace - remove last character
 */
export function handleBackspace(state: GameState): GameState {
  // Don't process if test is complete
  if (state.isComplete) {
    return state;
  }

  const { words, currentWordIndex, currentCharIndex } = state;

  // If at the start of a word (not the first word), go back to previous word
  if (currentCharIndex === 0 && currentWordIndex > 0) {
    const previousWord = words[currentWordIndex - 1];

    // Only allow going back if the previous word was not marked as correct
    // This prevents editing correctly typed words
    if (previousWord.isCompleted && !previousWord.isCorrect) {
      const newWords = [...words];
      const newWord = { ...previousWord };
      newWord.isCompleted = false;

      // Find the last typed position (including extras)
      const lastTypedIndex = newWord.characters.length;

      newWords[currentWordIndex - 1] = newWord;

      const newState: GameState = {
        ...state,
        words: newWords,
        currentWordIndex: currentWordIndex - 1,
        currentCharIndex: lastTypedIndex,
      };

      return {
        ...newState,
        stats: calculateStats(newState),
      };
    }

    return state;
  }

  // If at the start of the first word, do nothing
  if (currentCharIndex === 0) {
    return state;
  }

  const currentWord = words[currentWordIndex];
  const newWords = [...words];
  const newWord = { ...currentWord };
  const newCharacters = [...newWord.characters];

  // Remove extra character or reset character status
  if (currentCharIndex > currentWord.word.length) {
    // Remove the extra character
    newCharacters.pop();
  } else {
    // Reset the character to pending
    newCharacters[currentCharIndex - 1] = {
      char: currentWord.word[currentCharIndex - 1],
      status: "pending",
    };
  }

  newWord.characters = newCharacters;
  newWords[currentWordIndex] = newWord;

  const newState: GameState = {
    ...state,
    words: newWords,
    currentCharIndex: currentCharIndex - 1,
  };

  return {
    ...newState,
    stats: calculateStats(newState),
  };
}

/**
 * Calculate current stats (WPM, accuracy, etc.)
 */
export function calculateStats(state: GameState): TestStats {
  const { words, startTime, elapsedTime } = state;

  let correctChars = 0;
  let incorrectChars = 0;
  let extraChars = 0;
  let missedChars = 0;
  let totalChars = 0;
  let correctWords = 0;
  let incorrectWords = 0;

  for (const word of words) {
    if (!word.isCompleted) {
      // Count characters typed in the current incomplete word
      for (const char of word.characters) {
        if (char.status === "correct") {
          correctChars++;
          totalChars++;
        } else if (char.status === "incorrect") {
          incorrectChars++;
          totalChars++;
        } else if (char.status === "extra") {
          extraChars++;
          totalChars++;
        }
      }
      continue;
    }

    // Count completed word stats
    if (word.isCorrect) {
      correctWords++;
    } else {
      incorrectWords++;
    }

    const originalLength = word.word.length;
    let typedCount = 0;

    for (const char of word.characters) {
      if (char.status === "correct") {
        correctChars++;
        totalChars++;
        typedCount++;
      } else if (char.status === "incorrect") {
        incorrectChars++;
        totalChars++;
        typedCount++;
      } else if (char.status === "extra") {
        extraChars++;
        totalChars++;
      } else if (char.status === "pending") {
        // Character was never typed (skipped)
        missedChars++;
      }
    }

    // Count any characters that were completely skipped
    if (typedCount < originalLength) {
      const actualExtras = word.characters.filter((c) => c.status === "extra").length;
      const totalTyped = typedCount + actualExtras;
      if (totalTyped < originalLength) {
        missedChars += originalLength - typedCount;
      }
    }
  }

  // Add 1 for space after each completed word (except last word)
  const completedWords = words.filter((w) => w.isCompleted).length;
  if (completedWords > 0) {
    correctChars += completedWords; // Spaces count as correct chars
    totalChars += completedWords;
  }

  // Calculate elapsed time in seconds
  const elapsed = startTime
    ? elapsedTime > 0
      ? elapsedTime
      : (Date.now() - startTime) / 1000
    : 0;

  const wpm = calculateWPM(correctChars, elapsed);
  const rawWpm = calculateRawWPM(totalChars, elapsed);

  // Calculate accuracy
  const typedChars = correctChars + incorrectChars + extraChars;
  const accuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100;

  // Calculate consistency from WPM history
  const consistency = calculateConsistency(state.wpmHistory);

  return {
    wpm,
    rawWpm,
    accuracy,
    correctChars,
    incorrectChars,
    extraChars,
    missedChars,
    totalChars,
    correctWords,
    incorrectWords,
    consistency,
  };
}

/**
 * Calculate WPM: (correct chars / 5) / minutes
 * Standard word length is 5 characters
 */
export function calculateWPM(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) {
    return 0;
  }

  const minutes = elapsedSeconds / 60;
  const standardWords = correctChars / WORD_LENGTH_STANDARD;
  const wpm = standardWords / minutes;

  return Math.round(wpm);
}

/**
 * Calculate raw WPM: (total chars / 5) / minutes
 * Includes incorrect and extra characters
 */
export function calculateRawWPM(totalChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) {
    return 0;
  }

  const minutes = elapsedSeconds / 60;
  const standardWords = totalChars / WORD_LENGTH_STANDARD;
  const rawWpm = standardWords / minutes;

  return Math.round(rawWpm);
}

/**
 * Calculate consistency from WPM variance
 * Returns a percentage (0-100) where 100 is perfectly consistent
 */
export function calculateConsistency(wpmHistory: number[]): number {
  if (wpmHistory.length < 2) {
    return 100;
  }

  // Calculate mean
  const mean = wpmHistory.reduce((a, b) => a + b, 0) / wpmHistory.length;

  if (mean === 0) {
    return 100;
  }

  // Calculate variance
  const squaredDiffs = wpmHistory.map((wpm) => Math.pow(wpm - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / wpmHistory.length;

  // Calculate standard deviation
  const stdDev = Math.sqrt(variance);

  // Calculate coefficient of variation (CV)
  const cv = stdDev / mean;

  // Convert CV to consistency percentage
  // CV of 0 = 100% consistent, CV of 1 = 0% consistent
  const consistency = Math.max(0, Math.min(100, Math.round((1 - cv) * 100)));

  return consistency;
}

/**
 * Check if test is complete (time ran out or all words typed)
 */
export function isTestComplete(state: GameState): boolean {
  const { config, words, currentWordIndex, elapsedTime, isComplete } = state;

  // Already marked as complete
  if (isComplete) {
    return true;
  }

  // Time mode: check if time ran out
  if (config.mode === "time" && elapsedTime >= config.timeLimit) {
    return true;
  }

  // Words mode: check if all words are completed
  if (config.mode === "words" && currentWordIndex >= words.length) {
    return true;
  }

  return false;
}
