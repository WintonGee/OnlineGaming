// Button module logic for bomb defusal game

import {
  ButtonColor,
  ButtonText,
  StripColor,
  ButtonAction,
  ButtonModuleState,
  Edgework,
} from "../types";
import { BUTTON_COLORS, BUTTON_TEXTS, STRIP_COLORS, STRIP_RELEASE_DIGIT } from "../constants";
import { hasLitIndicator } from "./edgework";

/**
 * Generate a random button configuration
 */
export function generateButtonConfig(): { color: ButtonColor; text: ButtonText } {
  const colorIndex = Math.floor(Math.random() * BUTTON_COLORS.length);
  const textIndex = Math.floor(Math.random() * BUTTON_TEXTS.length);

  return {
    color: BUTTON_COLORS[colorIndex],
    text: BUTTON_TEXTS[textIndex],
  };
}

/**
 * Generate a random strip color
 */
export function generateStripColor(): StripColor {
  const index = Math.floor(Math.random() * STRIP_COLORS.length);
  return STRIP_COLORS[index];
}

/**
 * Determine whether to press or hold the button
 *
 * Rules (in order):
 * 1. Blue button with "Abort" text -> Hold
 * 2. More than 1 battery AND "Detonate" text -> Press immediately
 * 3. White button with CAR indicator lit -> Hold
 * 4. More than 2 batteries AND FRK indicator lit -> Press immediately
 * 5. Yellow button -> Hold
 * 6. Red button with "Hold" text -> Press immediately
 * 7. Otherwise -> Hold
 */
export function determineButtonAction(
  color: ButtonColor,
  text: ButtonText,
  edgework: Edgework
): ButtonAction {
  // Rule 1: Blue button with "Abort"
  if (color === "blue" && text === "Abort") {
    return "hold";
  }

  // Rule 2: >1 battery AND "Detonate"
  if (edgework.batteries > 1 && text === "Detonate") {
    return "press";
  }

  // Rule 3: White button with lit CAR
  if (color === "white" && hasLitIndicator(edgework, "CAR")) {
    return "hold";
  }

  // Rule 4: >2 batteries AND lit FRK
  if (edgework.batteries > 2 && hasLitIndicator(edgework, "FRK")) {
    return "press";
  }

  // Rule 5: Yellow button
  if (color === "yellow") {
    return "hold";
  }

  // Rule 6: Red button with "Hold"
  if (color === "red" && text === "Hold") {
    return "press";
  }

  // Rule 7: Otherwise
  return "hold";
}

/**
 * Get the digit to wait for when releasing based on strip color
 */
export function getReleaseDigit(stripColor: StripColor): string {
  return STRIP_RELEASE_DIGIT[stripColor] || STRIP_RELEASE_DIGIT.default;
}

/**
 * Check if timer contains the target digit
 */
export function timerContainsDigit(timerSeconds: number, targetDigit: string): boolean {
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const timerStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  return timerStr.includes(targetDigit);
}

/**
 * Generate button module state
 */
export function generateButtonModule(edgework: Edgework): ButtonModuleState {
  const { color, text } = generateButtonConfig();
  const correctAction = determineButtonAction(color, text, edgework);

  return {
    id: `button-${Date.now()}`,
    type: "button",
    status: "unsolved",
    buttonColor: color,
    buttonText: text,
    correctAction,
    stripColor: null,
    isHolding: false,
    holdStartTime: null,
  };
}

/**
 * Start holding the button
 */
export function startHold(state: ButtonModuleState): ButtonModuleState {
  return {
    ...state,
    isHolding: true,
    holdStartTime: Date.now(),
    stripColor: generateStripColor(),
  };
}

/**
 * Release the button and check if timing was correct
 */
export function releaseButton(
  state: ButtonModuleState,
  timerSeconds: number
): { newState: ButtonModuleState; isCorrect: boolean } {
  if (state.correctAction === "press") {
    // Should have pressed immediately, not held
    return {
      newState: { ...state, status: "strike", isHolding: false },
      isCorrect: false,
    };
  }

  // Check release timing for hold action
  if (state.stripColor) {
    const targetDigit = getReleaseDigit(state.stripColor);
    const correctTiming = timerContainsDigit(timerSeconds, targetDigit);

    return {
      newState: {
        ...state,
        status: correctTiming ? "solved" : "strike",
        isHolding: false,
      },
      isCorrect: correctTiming,
    };
  }

  return {
    newState: { ...state, status: "strike", isHolding: false },
    isCorrect: false,
  };
}

/**
 * Quick press the button (for press action)
 */
export function quickPress(
  state: ButtonModuleState
): { newState: ButtonModuleState; isCorrect: boolean } {
  const isCorrect = state.correctAction === "press";

  return {
    newState: {
      ...state,
      status: isCorrect ? "solved" : "strike",
    },
    isCorrect,
  };
}
