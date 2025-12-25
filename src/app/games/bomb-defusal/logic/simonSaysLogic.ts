// Simon Says module logic for bomb defusal game

import { SimonColor, SimonSaysModuleState, Edgework } from "../types";
import {
  SIMON_COLORS,
  SIMON_MAPPING_VOWEL,
  SIMON_MAPPING_NO_VOWEL,
  SIMON_STAGES_MIN,
  SIMON_STAGES_MAX,
} from "../constants";

/**
 * Get the color mapping based on serial vowel and strike count
 */
export function getColorMapping(
  hasVowel: boolean,
  strikes: number
): Record<SimonColor, SimonColor> {
  const strikeTier = Math.min(strikes, 2) as 0 | 1 | 2;
  return hasVowel
    ? SIMON_MAPPING_VOWEL[strikeTier]
    : SIMON_MAPPING_NO_VOWEL[strikeTier];
}

/**
 * Get the expected button color for a flashed color
 */
export function getExpectedColor(
  flashedColor: SimonColor,
  edgework: Edgework,
  strikes: number
): SimonColor {
  const mapping = getColorMapping(edgework.serialNumber.hasVowel, strikes);
  return mapping[flashedColor];
}

/**
 * Get the expected sequence for the current stage
 */
export function getExpectedSequence(
  sequence: SimonColor[],
  stageLength: number,
  edgework: Edgework,
  strikes: number
): SimonColor[] {
  return sequence
    .slice(0, stageLength)
    .map((color) => getExpectedColor(color, edgework, strikes));
}

/**
 * Generate a random Simon Says sequence
 */
export function generateSequence(length: number): SimonColor[] {
  return Array.from({ length }, () => {
    const index = Math.floor(Math.random() * SIMON_COLORS.length);
    return SIMON_COLORS[index];
  });
}

/**
 * Generate Simon Says module state
 */
export function generateSimonSaysModule(): SimonSaysModuleState {
  const totalStages =
    SIMON_STAGES_MIN + Math.floor(Math.random() * (SIMON_STAGES_MAX - SIMON_STAGES_MIN + 1));
  const sequence = generateSequence(totalStages);

  return {
    id: `simon-says-${Date.now()}`,
    type: "simon-says",
    status: "unsolved",
    sequence,
    currentStage: 0,
    playerInput: [],
    isFlashing: false,
    currentFlashIndex: -1,
    totalStages,
  };
}

/**
 * Validate player input for current stage
 */
export function validateInput(
  state: SimonSaysModuleState,
  inputColor: SimonColor,
  edgework: Edgework,
  strikes: number
): { isCorrect: boolean; isStageComplete: boolean; isModuleSolved: boolean } {
  const expectedSequence = getExpectedSequence(
    state.sequence,
    state.currentStage + 1, // Current stage is 0-indexed
    edgework,
    strikes
  );

  const inputIndex = state.playerInput.length;
  const expectedColor = expectedSequence[inputIndex];
  const isCorrect = inputColor === expectedColor;

  if (!isCorrect) {
    return { isCorrect: false, isStageComplete: false, isModuleSolved: false };
  }

  const newInputLength = inputIndex + 1;
  const isStageComplete = newInputLength === state.currentStage + 1;
  const isModuleSolved = isStageComplete && state.currentStage + 1 >= state.totalStages;

  return { isCorrect: true, isStageComplete, isModuleSolved };
}

/**
 * Add player input to the state
 */
export function addPlayerInput(
  state: SimonSaysModuleState,
  color: SimonColor
): SimonSaysModuleState {
  return {
    ...state,
    playerInput: [...state.playerInput, color],
  };
}

/**
 * Advance to next stage
 */
export function advanceStage(state: SimonSaysModuleState): SimonSaysModuleState {
  return {
    ...state,
    currentStage: state.currentStage + 1,
    playerInput: [],
    isFlashing: false,
    currentFlashIndex: -1,
  };
}

/**
 * Start flashing sequence for current stage
 */
export function startFlashing(state: SimonSaysModuleState): SimonSaysModuleState {
  return {
    ...state,
    isFlashing: true,
    currentFlashIndex: 0,
    playerInput: [],
  };
}

/**
 * Advance to next flash in sequence
 */
export function advanceFlash(state: SimonSaysModuleState): SimonSaysModuleState {
  const nextIndex = state.currentFlashIndex + 1;
  const isComplete = nextIndex > state.currentStage;

  return {
    ...state,
    currentFlashIndex: isComplete ? -1 : nextIndex,
    isFlashing: !isComplete,
  };
}

/**
 * Mark module as solved
 */
export function markSolved(state: SimonSaysModuleState): SimonSaysModuleState {
  return {
    ...state,
    status: "solved",
    isFlashing: false,
    currentFlashIndex: -1,
  };
}

/**
 * Handle strike (reset player input but keep stage)
 */
export function handleStrike(state: SimonSaysModuleState): SimonSaysModuleState {
  return {
    ...state,
    status: "strike",
    playerInput: [],
    isFlashing: false,
    currentFlashIndex: -1,
  };
}
