// Memory module logic for bomb defusal game

import { MemoryModuleState, MemoryStageHistory } from "../types";
import { MEMORY_RULES } from "../constants";

type DisplayValue = 1 | 2 | 3 | 4;
type ButtonPosition = 1 | 2 | 3 | 4;
type ButtonLabel = 1 | 2 | 3 | 4;

/**
 * Generate shuffled button labels [1,2,3,4]
 */
function generateButtonLabels(): number[] {
  const labels = [1, 2, 3, 4];
  for (let i = labels.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [labels[i], labels[j]] = [labels[j], labels[i]];
  }
  return labels;
}

/**
 * Generate a random display value (1-4)
 */
function generateDisplayValue(): DisplayValue {
  return (Math.floor(Math.random() * 4) + 1) as DisplayValue;
}

/**
 * Parse a rule string into action components
 */
function parseRule(rule: string): {
  type: "pos" | "label" | "stage";
  value?: number;
  stageRef?: number;
  usePosition?: boolean;
} {
  if (rule.startsWith("pos:")) {
    return { type: "pos", value: parseInt(rule.split(":")[1], 10) };
  }
  if (rule.startsWith("label:")) {
    return { type: "label", value: parseInt(rule.split(":")[1], 10) };
  }
  if (rule.startsWith("stage:")) {
    const parts = rule.split(":");
    return {
      type: "stage",
      stageRef: parseInt(parts[1], 10),
      usePosition: parts[2] === "pos",
    };
  }
  throw new Error(`Unknown rule format: ${rule}`);
}

/**
 * Determine the correct button to press based on stage and display
 */
export function determineCorrectButton(
  stage: number,
  displayValue: DisplayValue,
  buttonLabels: number[],
  history: MemoryStageHistory[]
): { position: ButtonPosition; label: ButtonLabel } {
  const ruleKey = `${stage}-${displayValue}`;
  const rule = MEMORY_RULES[stage]?.[displayValue];

  if (!rule) {
    throw new Error(`No rule found for stage ${stage}, display ${displayValue}`);
  }

  const parsed = parseRule(rule);

  if (parsed.type === "pos") {
    // Press button at specific position
    const position = parsed.value! as ButtonPosition;
    const label = buttonLabels[position - 1] as ButtonLabel;
    return { position, label };
  }

  if (parsed.type === "label") {
    // Press button with specific label
    const label = parsed.value! as ButtonLabel;
    const position = (buttonLabels.indexOf(label) + 1) as ButtonPosition;
    return { position, label };
  }

  if (parsed.type === "stage") {
    // Reference a previous stage
    const prevStage = history.find((h) => h.stage === parsed.stageRef);
    if (!prevStage) {
      throw new Error(`No history found for stage ${parsed.stageRef}`);
    }

    if (parsed.usePosition) {
      // Use same POSITION as referenced stage
      const position = prevStage.pressedPosition as ButtonPosition;
      const label = buttonLabels[position - 1] as ButtonLabel;
      return { position, label };
    } else {
      // Use same LABEL as referenced stage
      const label = prevStage.pressedLabel as ButtonLabel;
      const position = (buttonLabels.indexOf(label) + 1) as ButtonPosition;
      return { position, label };
    }
  }

  throw new Error("Invalid rule type");
}

/**
 * Generate Memory module state
 */
export function generateMemoryModule(): MemoryModuleState {
  return {
    id: `memory-${Date.now()}`,
    type: "memory",
    status: "unsolved",
    currentStage: 1,
    displayNumber: generateDisplayValue(),
    buttonLabels: generateButtonLabels(),
    history: [],
  };
}

/**
 * Process a button press
 */
export function pressButton(
  state: MemoryModuleState,
  position: ButtonPosition
): { newState: MemoryModuleState; isCorrect: boolean; isModuleSolved: boolean } {
  const { position: correctPosition, label } = determineCorrectButton(
    state.currentStage,
    state.displayNumber as DisplayValue,
    state.buttonLabels,
    state.history
  );

  const pressedLabel = state.buttonLabels[position - 1] as ButtonLabel;
  const isCorrect = position === correctPosition;

  if (!isCorrect) {
    // Wrong - reset to stage 1
    return {
      newState: {
        ...state,
        status: "strike",
        currentStage: 1,
        displayNumber: generateDisplayValue(),
        buttonLabels: generateButtonLabels(),
        history: [],
      },
      isCorrect: false,
      isModuleSolved: false,
    };
  }

  // Correct - record history and advance
  const newHistory: MemoryStageHistory = {
    stage: state.currentStage as 1 | 2 | 3 | 4 | 5,
    displayNumber: state.displayNumber,
    buttonLabels: [...state.buttonLabels] as [number, number, number, number],
    pressedPosition: position,
    pressedLabel,
  };

  const updatedHistory = [...state.history, newHistory];
  const isModuleSolved = state.currentStage >= 5;

  if (isModuleSolved) {
    return {
      newState: {
        ...state,
        status: "solved",
        history: updatedHistory,
      },
      isCorrect: true,
      isModuleSolved: true,
    };
  }

  // Advance to next stage
  return {
    newState: {
      ...state,
      currentStage: (state.currentStage + 1) as 1 | 2 | 3 | 4 | 5,
      displayNumber: generateDisplayValue(),
      buttonLabels: generateButtonLabels(),
      history: updatedHistory,
    },
    isCorrect: true,
    isModuleSolved: false,
  };
}
