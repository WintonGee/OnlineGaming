// Core types for Bomb Defusal game (Keep Talking and Nobody Explodes style)

// =============================================================================
// GAME PHASE & DIFFICULTY
// =============================================================================

export type GamePhase = "menu" | "setup" | "playing" | "defused" | "exploded";

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface DifficultyConfig {
  label: string;
  moduleCount: number;
  timerSeconds: number;
  maxStrikes: number;
  needyModules: boolean;
}

// =============================================================================
// BOMB EDGEWORK (affects module rules)
// =============================================================================

export interface SerialNumber {
  value: string;
  lastDigitOdd: boolean;
  hasVowel: boolean;
}

export type IndicatorLabel = "SND" | "CLR" | "CAR" | "IND" | "FRQ" | "SIG" | "NSA" | "MSA" | "TRN" | "BOB" | "FRK";

export interface Indicator {
  label: IndicatorLabel;
  lit: boolean;
}

export type PortType = "DVI-D" | "Parallel" | "PS/2" | "RJ-45" | "Serial" | "Stereo RCA";

export interface Edgework {
  serialNumber: SerialNumber;
  batteries: number;
  batteryHolders: number; // AA holders count as 1, D holders count as 1
  indicators: Indicator[];
  ports: PortType[];
}

// =============================================================================
// MODULE TYPES
// =============================================================================

export type ModuleType =
  | "wires"
  | "button"
  | "simon-says"
  | "memory"
  | "password"
  | "morse-code";

export type ModuleStatus = "unsolved" | "solved" | "strike";

export interface BaseModuleState {
  id: string;
  type: ModuleType;
  status: ModuleStatus;
}

// =============================================================================
// WIRES MODULE
// =============================================================================

export type WireColor = "red" | "blue" | "yellow" | "white" | "black";

export interface Wire {
  color: WireColor;
  cut: boolean;
  position: number; // 1-indexed from top
}

export interface WiresModuleState extends BaseModuleState {
  type: "wires";
  wires: Wire[];
  correctWirePosition: number;
}

// =============================================================================
// BUTTON MODULE
// =============================================================================

export type ButtonColor = "red" | "blue" | "yellow" | "white";
export type ButtonText = "Abort" | "Detonate" | "Hold" | "Press";
export type StripColor = "red" | "blue" | "yellow" | "white" | "green" | "orange";

export type ButtonAction = "press" | "hold";

export interface ButtonModuleState extends BaseModuleState {
  type: "button";
  buttonColor: ButtonColor;
  buttonText: ButtonText;
  correctAction: ButtonAction;
  stripColor: StripColor | null; // Only shown when holding
  isHolding: boolean;
  holdStartTime: number | null;
}

// =============================================================================
// SIMON SAYS MODULE
// =============================================================================

export type SimonColor = "red" | "blue" | "green" | "yellow";

export interface SimonSaysModuleState extends BaseModuleState {
  type: "simon-says";
  sequence: SimonColor[];
  currentStage: number; // 0-indexed, stages 0-4
  playerInput: SimonColor[];
  isFlashing: boolean;
  currentFlashIndex: number;
  totalStages: number; // 3-5 stages to complete
}

// =============================================================================
// MEMORY MODULE
// =============================================================================

export interface MemoryStageHistory {
  stage: 1 | 2 | 3 | 4 | 5;
  displayNumber: number;
  buttonLabels: [number, number, number, number]; // The 4 button labels in order [pos1, pos2, pos3, pos4]
  pressedPosition: number; // 1-4
  pressedLabel: number; // 1-4
}

export interface MemoryModuleState extends BaseModuleState {
  type: "memory";
  currentStage: number; // 1-5
  displayNumber: number; // 1-4
  buttonLabels: number[]; // Shuffled [1,2,3,4] for current stage
  history: MemoryStageHistory[];
}

// =============================================================================
// PASSWORD MODULE
// =============================================================================

export interface PasswordModuleState extends BaseModuleState {
  type: "password";
  columns: string[][]; // 5 columns, each with 6 letters
  currentIndices: number[]; // Current letter index for each column (0-5)
  correctWord: string;
}

// =============================================================================
// MORSE CODE MODULE
// =============================================================================

export interface MorseCodeModuleState extends BaseModuleState {
  type: "morse-code";
  word: string;
  correctFrequency: number;
  currentFrequency: number;
  isFlashing: boolean;
  currentFlashIndex: number;
  flashSequence: ("dot" | "dash" | "letterGap" | "wordGap")[];
}

// =============================================================================
// UNION TYPE FOR ALL MODULES
// =============================================================================

export type ModuleState =
  | WiresModuleState
  | ButtonModuleState
  | SimonSaysModuleState
  | MemoryModuleState
  | PasswordModuleState
  | MorseCodeModuleState;

// =============================================================================
// BOMB STATE
// =============================================================================

export interface BombState {
  edgework: Edgework;
  modules: ModuleState[];
  strikes: number;
  maxStrikes: number;
  timerSeconds: number;
  isDefused: boolean;
  isExploded: boolean;
}

// =============================================================================
// GAME STATS
// =============================================================================

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  bestTime: Partial<Record<Difficulty, number>>;
  totalModulesSolved: number;
}

// =============================================================================
// UI STATE
// =============================================================================

export interface ManualReference {
  moduleType: ModuleType | null;
  isOpen: boolean;
}
