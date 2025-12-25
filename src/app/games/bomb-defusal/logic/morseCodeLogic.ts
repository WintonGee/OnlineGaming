// Morse Code module logic for bomb defusal game

import { MorseCodeModuleState } from "../types";
import {
  MORSE_ALPHABET,
  MORSE_WORDS,
  MORSE_DOT_DURATION_MS,
  MORSE_DASH_DURATION_MS,
  MORSE_LETTER_GAP_MS,
  MORSE_WORD_GAP_MS,
  MORSE_FREQUENCY_MIN,
  MORSE_FREQUENCY_MAX,
  MORSE_FREQUENCY_STEP,
} from "../constants";

type FlashElement = "dot" | "dash" | "letterGap" | "wordGap";

interface FlashSequenceItem {
  type: FlashElement;
  duration: number;
  isOn: boolean;
}

/**
 * Convert a character to morse elements
 */
function charToMorse(char: string): ("dot" | "dash")[] {
  const morse = MORSE_ALPHABET[char.toLowerCase()];
  if (!morse) return [];
  return morse.split("").map((s) => (s === "." ? "dot" : "dash"));
}

/**
 * Generate flash sequence for a word
 */
export function generateFlashSequence(word: string): FlashSequenceItem[] {
  const sequence: FlashSequenceItem[] = [];

  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    const elements = charToMorse(char);

    for (let j = 0; j < elements.length; j++) {
      const elem = elements[j];

      // Add the flash (on)
      sequence.push({
        type: elem,
        duration: elem === "dot" ? MORSE_DOT_DURATION_MS : MORSE_DASH_DURATION_MS,
        isOn: true,
      });

      // Add inter-element gap (off) - except after last element of letter
      if (j < elements.length - 1) {
        sequence.push({
          type: "dot",
          duration: MORSE_DOT_DURATION_MS,
          isOn: false,
        });
      }
    }

    // Add letter gap (off) - except after last letter
    if (i < word.length - 1) {
      sequence.push({
        type: "letterGap",
        duration: MORSE_LETTER_GAP_MS,
        isOn: false,
      });
    }
  }

  // Add word gap at end for looping
  sequence.push({
    type: "wordGap",
    duration: MORSE_WORD_GAP_MS,
    isOn: false,
  });

  return sequence;
}

/**
 * Get all valid morse code words
 */
export function getMorseWords(): string[] {
  return Object.keys(MORSE_WORDS);
}

/**
 * Get frequency for a word
 */
export function getFrequencyForWord(word: string): number | null {
  return MORSE_WORDS[word] ?? null;
}

/**
 * Get word for a frequency
 */
export function getWordForFrequency(frequency: number): string | null {
  for (const [word, freq] of Object.entries(MORSE_WORDS)) {
    if (Math.abs(freq - frequency) < 0.0001) {
      return word;
    }
  }
  return null;
}

/**
 * Select a random morse word
 */
export function selectRandomWord(): string {
  const words = getMorseWords();
  return words[Math.floor(Math.random() * words.length)];
}

/**
 * Generate Morse Code module state
 */
export function generateMorseCodeModule(): MorseCodeModuleState {
  const word = selectRandomWord();
  const correctFrequency = MORSE_WORDS[word];
  const flashSequence = generateFlashSequence(word);

  return {
    id: `morse-code-${Date.now()}`,
    type: "morse-code",
    status: "unsolved",
    word,
    correctFrequency,
    currentFrequency: (MORSE_FREQUENCY_MIN + MORSE_FREQUENCY_MAX) / 2, // Start in middle
    isFlashing: false,
    currentFlashIndex: 0,
    flashSequence: flashSequence.map((item) => item.type),
  };
}

/**
 * Get flash sequence items with timing
 */
export function getFlashSequenceWithTiming(state: MorseCodeModuleState): FlashSequenceItem[] {
  return generateFlashSequence(state.word);
}

/**
 * Increment frequency
 */
export function incrementFrequency(
  state: MorseCodeModuleState,
  step: number = MORSE_FREQUENCY_STEP
): MorseCodeModuleState {
  const newFreq = Math.min(MORSE_FREQUENCY_MAX, state.currentFrequency + step);
  return {
    ...state,
    currentFrequency: Math.round(newFreq * 1000) / 1000,
  };
}

/**
 * Decrement frequency
 */
export function decrementFrequency(
  state: MorseCodeModuleState,
  step: number = MORSE_FREQUENCY_STEP
): MorseCodeModuleState {
  const newFreq = Math.max(MORSE_FREQUENCY_MIN, state.currentFrequency - step);
  return {
    ...state,
    currentFrequency: Math.round(newFreq * 1000) / 1000,
  };
}

/**
 * Set frequency directly
 */
export function setFrequency(
  state: MorseCodeModuleState,
  frequency: number
): MorseCodeModuleState {
  const clamped = Math.max(MORSE_FREQUENCY_MIN, Math.min(MORSE_FREQUENCY_MAX, frequency));
  return {
    ...state,
    currentFrequency: Math.round(clamped * 1000) / 1000,
  };
}

/**
 * Format frequency for display
 */
export function formatFrequency(frequency: number): string {
  return `${frequency.toFixed(3)} MHz`;
}

/**
 * Start flashing
 */
export function startFlashing(state: MorseCodeModuleState): MorseCodeModuleState {
  return {
    ...state,
    isFlashing: true,
    currentFlashIndex: 0,
  };
}

/**
 * Stop flashing
 */
export function stopFlashing(state: MorseCodeModuleState): MorseCodeModuleState {
  return {
    ...state,
    isFlashing: false,
    currentFlashIndex: 0,
  };
}

/**
 * Advance to next flash element
 */
export function advanceFlash(state: MorseCodeModuleState): MorseCodeModuleState {
  const sequence = generateFlashSequence(state.word);
  const nextIndex = (state.currentFlashIndex + 1) % sequence.length;

  return {
    ...state,
    currentFlashIndex: nextIndex,
  };
}

/**
 * Submit frequency answer
 */
export function submitFrequency(
  state: MorseCodeModuleState
): { newState: MorseCodeModuleState; isCorrect: boolean } {
  const isCorrect = Math.abs(state.currentFrequency - state.correctFrequency) < 0.0001;

  return {
    newState: {
      ...state,
      status: isCorrect ? "solved" : "strike",
      isFlashing: false,
    },
    isCorrect,
  };
}

/**
 * Get current flash state (on/off)
 */
export function isLightOn(state: MorseCodeModuleState): boolean {
  if (!state.isFlashing) return false;
  const sequence = generateFlashSequence(state.word);
  if (state.currentFlashIndex >= sequence.length) return false;
  return sequence[state.currentFlashIndex].isOn;
}

/**
 * Get current element duration
 */
export function getCurrentElementDuration(state: MorseCodeModuleState): number {
  const sequence = generateFlashSequence(state.word);
  if (state.currentFlashIndex >= sequence.length) return 0;
  return sequence[state.currentFlashIndex].duration;
}
