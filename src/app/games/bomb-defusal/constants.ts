import {
  Difficulty,
  DifficultyConfig,
  SimonColor,
  IndicatorLabel,
  KeypadSymbol,
} from "./types";

// =============================================================================
// DIFFICULTY SETTINGS
// =============================================================================

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  Easy: {
    label: "Easy",
    moduleCount: 3,
    timerSeconds: 300, // 5 minutes
    maxStrikes: 3,
    needyModules: false,
  },
  Medium: {
    label: "Medium",
    moduleCount: 5,
    timerSeconds: 300, // 5 minutes
    maxStrikes: 3,
    needyModules: false,
  },
  Hard: {
    label: "Hard",
    moduleCount: 6,
    timerSeconds: 240, // 4 minutes
    maxStrikes: 2,
    needyModules: false,
  },
  Custom: {
    label: "Custom",
    moduleCount: 5, // Default, can be overridden
    timerSeconds: 300, // Default, can be overridden
    maxStrikes: 3, // Default, can be overridden
    needyModules: false,
  },
} as const;

// =============================================================================
// CUSTOM MODE LIMITS
// =============================================================================

export const CUSTOM_MODE_LIMITS = {
  minModules: 1,
  maxModules: 12,
  minTime: 60, // 1 minute
  maxTime: 600, // 10 minutes
  minStrikes: 1,
  maxStrikes: 5,
} as const;

export const CUSTOM_TIME_PRESETS = [60, 120, 180, 240, 300, 420, 600] as const;

export const DEFAULT_DIFFICULTY: Difficulty = "Medium";

// =============================================================================
// STORAGE KEYS
// =============================================================================

export const STORAGE_KEYS = {
  GAME_STATS: "bomb-defusal-stats",
  BEST_TIMES: "bomb-defusal-best-times",
} as const;

// =============================================================================
// TIMER SETTINGS
// =============================================================================

export const TIMER_TICK_MS = 1000;
export const STRIKE_SPEED_MULTIPLIER = 1.25; // Timer speeds up after each strike

// =============================================================================
// WIRES MODULE CONSTANTS
// =============================================================================

export const WIRE_COLORS = ["red", "blue", "yellow", "white", "black"] as const;
export const MIN_WIRES = 3;
export const MAX_WIRES = 6;

// =============================================================================
// BUTTON MODULE CONSTANTS
// =============================================================================

export const BUTTON_COLORS = ["red", "blue", "yellow", "white"] as const;
export const BUTTON_TEXTS = ["Abort", "Detonate", "Hold", "Press"] as const;
export const STRIP_COLORS = ["red", "blue", "yellow", "white", "green", "orange"] as const;

// Button release timing - which digit to look for in timer
export const STRIP_RELEASE_DIGIT: Record<string, string> = {
  blue: "4",
  white: "1",
  yellow: "5",
  default: "1",
} as const;

// =============================================================================
// SIMON SAYS MODULE CONSTANTS
// =============================================================================

export const SIMON_COLORS: SimonColor[] = ["red", "blue", "green", "yellow"];

// Color mappings based on serial vowel and strike count
// WITH VOWEL in serial number
export const SIMON_MAPPING_VOWEL: Record<number, Record<SimonColor, SimonColor>> = {
  0: { red: "blue", blue: "red", green: "yellow", yellow: "green" },
  1: { red: "yellow", blue: "green", green: "blue", yellow: "red" },
  2: { red: "green", blue: "red", green: "yellow", yellow: "blue" },
} as const;

// NO VOWEL in serial number
export const SIMON_MAPPING_NO_VOWEL: Record<number, Record<SimonColor, SimonColor>> = {
  0: { red: "blue", blue: "yellow", green: "green", yellow: "red" },
  1: { red: "red", blue: "blue", green: "yellow", yellow: "green" },
  2: { red: "yellow", blue: "green", green: "blue", yellow: "red" },
} as const;

export const SIMON_FLASH_DURATION_MS = 500;
export const SIMON_GAP_DURATION_MS = 200;
export const SIMON_STAGES_MIN = 3;
export const SIMON_STAGES_MAX = 5;

// =============================================================================
// MEMORY MODULE CONSTANTS
// =============================================================================

// Stage rules: [displayNumber] -> instruction
// "pos:N" means press button at position N
// "label:N" means press button with label N
// "stage:N:pos" means press same position as stage N
// "stage:N:label" means press same label as stage N

export const MEMORY_RULES: Record<number, Record<number, string>> = {
  1: {
    1: "pos:2",
    2: "pos:2",
    3: "pos:3",
    4: "pos:4",
  },
  2: {
    1: "label:4",
    2: "stage:1:pos",
    3: "pos:1",
    4: "stage:1:pos",
  },
  3: {
    1: "stage:2:label",
    2: "stage:1:label",
    3: "pos:3",
    4: "label:4",
  },
  4: {
    1: "stage:1:pos",
    2: "pos:1",
    3: "stage:2:pos",
    4: "stage:2:pos",
  },
  5: {
    1: "stage:1:label",
    2: "stage:2:label",
    3: "stage:4:label",
    4: "stage:3:label",
  },
} as const;

// =============================================================================
// PASSWORD MODULE CONSTANTS
// =============================================================================

export const PASSWORD_WORDS = [
  "about", "after", "again", "below", "could",
  "every", "first", "found", "great", "house",
  "large", "learn", "never", "other", "place",
  "plant", "point", "right", "small", "sound",
  "spell", "still", "study", "their", "there",
  "these", "thing", "think", "three", "water",
  "where", "which", "world", "would", "write",
] as const;

export const PASSWORD_LETTERS_PER_COLUMN = 6;
export const PASSWORD_COLUMNS = 5;

// =============================================================================
// MORSE CODE MODULE CONSTANTS
// =============================================================================

export const MORSE_ALPHABET: Record<string, string> = {
  a: ".-",    b: "-...",  c: "-.-.",  d: "-..",   e: ".",
  f: "..-.",  g: "--.",   h: "....",  i: "..",    j: ".---",
  k: "-.-",   l: ".-..",  m: "--",    n: "-.",    o: "---",
  p: ".--.",  q: "--.-",  r: ".-.",   s: "...",   t: "-",
  u: "..-",   v: "...-",  w: ".--",   x: "-..-",  y: "-.--",
  z: "--..",
} as const;

export const MORSE_WORDS: Record<string, number> = {
  shell: 3.505,
  halls: 3.515,
  slick: 3.522,
  trick: 3.532,
  boxes: 3.535,
  leaks: 3.542,
  strobe: 3.545,
  bistro: 3.552,
  flick: 3.555,
  bombs: 3.565,
  break: 3.572,
  brick: 3.575,
  steak: 3.582,
  sting: 3.592,
  vector: 3.595,
  beats: 3.600,
} as const;

export const MORSE_DOT_DURATION_MS = 200;
export const MORSE_DASH_DURATION_MS = 600; // 3x dot
export const MORSE_LETTER_GAP_MS = 600; // 3x dot
export const MORSE_WORD_GAP_MS = 1400; // 7x dot
export const MORSE_FREQUENCY_MIN = 3.505;
export const MORSE_FREQUENCY_MAX = 3.600;
export const MORSE_FREQUENCY_STEP = 0.001;

// =============================================================================
// EDGEWORK CONSTANTS
// =============================================================================

export const INDICATOR_LABELS: IndicatorLabel[] = [
  "SND", "CLR", "CAR", "IND", "FRQ", "SIG", "NSA", "MSA", "TRN", "BOB", "FRK",
];

export const PORT_TYPES = [
  "DVI-D", "Parallel", "PS/2", "RJ-45", "Serial", "Stereo RCA",
] as const;

export const SERIAL_VOWELS = ["A", "E", "I", "O", "U"];
export const SERIAL_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
export const SERIAL_LENGTH = 6;

// =============================================================================
// KEYPADS MODULE CONSTANTS
// =============================================================================

// The 6 columns of symbols - each keypad will use 4 symbols from one column
export const KEYPAD_COLUMNS: KeypadSymbol[][] = [
  ["balloon", "at", "upsidedowny", "squigglyn", "squidknife", "hookn", "leftc"],
  ["euro", "balloon", "leftc", "cursive", "hollowStar", "hookn", "questionmark"],
  ["copyright", "pumpkin", "cursive", "doublek", "meltedthree", "upsidedowny", "hollowStar"],
  ["six", "paragraph", "bt", "squidknife", "doublek", "questionmark", "smiley"],
  ["pitchfork", "smiley", "bt", "rightc", "paragraph", "dragon", "filledStar"],
  ["six", "euro", "tracks", "ae", "pitchfork", "nwithhat", "omega"],
];

// Symbol display names for the manual/help
export const KEYPAD_SYMBOL_NAMES: Record<KeypadSymbol, string> = {
  copyright: "©",
  filledStar: "★",
  hollowStar: "☆",
  smiley: "ټ",
  doublek: "Ѭ",
  omega: "Ω",
  squidknife: "Ͽ",
  pumpkin: "Ѣ",
  hookn: "ƛ",
  six: "6",
  squigglyn: "Ϙ",
  at: "Ѧ",
  ae: "Æ",
  meltedthree: "Ӭ",
  euro: "€",
  nwithhat: "Ñ",
  dragon: "Ψ",
  questionmark: "¿",
  paragraph: "¶",
  rightc: "Ͼ",
  leftc: "Ͽ",
  pitchfork: "Ψ",
  cursive: "ϗ",
  tracks: "҂",
  balloon: "Ϙ",
  upsidedowny: "ƛ",
  bt: "Ѯ",
};

// =============================================================================
// MAZE MODULE CONSTANTS
// =============================================================================

// 9 predefined mazes with their indicator positions and wall data
// Each maze is a 6x6 grid. Walls are stored as adjacency (which cells can't be traversed between)
// Format: Array of [row1, col1, row2, col2] pairs indicating walls between adjacent cells

export const MAZE_INDICATORS: [{ row: number; col: number }, { row: number; col: number }][] = [
  [{ row: 0, col: 1 }, { row: 5, col: 2 }], // Maze 0
  [{ row: 1, col: 4 }, { row: 3, col: 1 }], // Maze 1
  [{ row: 3, col: 5 }, { row: 4, col: 2 }], // Maze 2
  [{ row: 0, col: 0 }, { row: 0, col: 3 }], // Maze 3
  [{ row: 2, col: 4 }, { row: 4, col: 1 }], // Maze 4
  [{ row: 2, col: 0 }, { row: 4, col: 3 }], // Maze 5
  [{ row: 1, col: 0 }, { row: 1, col: 5 }], // Maze 6
  [{ row: 3, col: 0 }, { row: 2, col: 3 }], // Maze 7
  [{ row: 0, col: 2 }, { row: 3, col: 3 }], // Maze 8
];

// Walls for each maze stored as a set of blocked passages
// Each entry is [fromRow, fromCol, toRow, toCol] - a wall between these two adjacent cells
export const MAZE_WALLS: number[][][] = [
  // Maze 0
  [[0,0,0,1],[0,0,1,0],[0,2,0,3],[0,4,1,4],[1,0,1,1],[1,1,1,2],[1,2,2,2],[1,3,1,4],[1,4,1,5],[2,0,2,1],[2,1,2,2],[2,2,2,3],[2,3,3,3],[2,4,2,5],[3,0,3,1],[3,1,3,2],[3,2,3,3],[3,3,3,4],[3,5,4,5],[4,0,4,1],[4,1,5,1],[4,2,4,3],[4,3,4,4],[4,4,5,4],[5,1,5,2],[5,2,5,3]],
  // Maze 1
  [[0,0,1,0],[0,1,0,2],[0,3,0,4],[0,4,0,5],[1,1,1,2],[1,2,1,3],[1,3,2,3],[1,4,2,4],[2,0,2,1],[2,1,3,1],[2,2,2,3],[2,4,2,5],[3,0,3,1],[3,2,3,3],[3,3,3,4],[3,4,4,4],[3,5,4,5],[4,0,5,0],[4,1,4,2],[4,2,5,2],[4,3,4,4],[5,0,5,1],[5,2,5,3],[5,3,5,4]],
  // Maze 2
  [[0,0,0,1],[0,2,0,3],[0,3,1,3],[0,4,0,5],[1,0,1,1],[1,1,2,1],[1,2,1,3],[1,4,1,5],[2,0,3,0],[2,2,2,3],[2,3,2,4],[2,4,3,4],[3,0,3,1],[3,1,3,2],[3,2,4,2],[3,3,3,4],[3,5,4,5],[4,0,4,1],[4,2,4,3],[4,3,5,3],[4,4,4,5],[5,0,5,1],[5,1,5,2]],
  // Maze 3
  [[0,1,0,2],[0,4,0,5],[0,4,1,4],[1,0,1,1],[1,1,1,2],[1,2,2,2],[1,3,1,4],[1,5,2,5],[2,0,2,1],[2,2,2,3],[2,3,3,3],[2,4,2,5],[3,0,4,0],[3,1,3,2],[3,2,3,3],[3,4,3,5],[3,4,4,4],[4,1,4,2],[4,2,5,2],[4,3,4,4],[4,5,5,5],[5,0,5,1],[5,2,5,3],[5,3,5,4]],
  // Maze 4
  [[0,0,0,1],[0,2,0,3],[0,3,0,4],[0,5,1,5],[1,0,2,0],[1,1,1,2],[1,2,1,3],[1,4,1,5],[2,1,2,2],[2,2,3,2],[2,3,2,4],[2,4,3,4],[3,0,3,1],[3,1,4,1],[3,3,3,4],[3,4,3,5],[4,0,5,0],[4,2,4,3],[4,3,5,3],[4,4,4,5],[5,0,5,1],[5,1,5,2],[5,4,5,5]],
  // Maze 5
  [[0,0,0,1],[0,2,0,3],[0,3,1,3],[0,4,1,4],[1,0,1,1],[1,1,2,1],[1,2,1,3],[1,5,2,5],[2,1,2,2],[2,2,2,3],[2,4,2,5],[2,4,3,4],[3,0,3,1],[3,1,3,2],[3,2,4,2],[3,3,3,4],[3,5,4,5],[4,0,4,1],[4,1,5,1],[4,3,4,4],[4,4,5,4],[5,1,5,2],[5,2,5,3]],
  // Maze 6
  [[0,1,0,2],[0,2,1,2],[0,3,0,4],[0,4,0,5],[1,0,1,1],[1,3,1,4],[1,4,2,4],[2,0,2,1],[2,1,2,2],[2,2,2,3],[2,3,3,3],[2,5,3,5],[3,0,3,1],[3,1,4,1],[3,2,3,3],[3,4,3,5],[4,0,5,0],[4,2,4,3],[4,3,4,4],[4,4,5,4],[4,5,5,5],[5,1,5,2],[5,2,5,3]],
  // Maze 7
  [[0,0,0,1],[0,2,0,3],[0,3,0,4],[0,5,1,5],[1,0,1,1],[1,1,1,2],[1,3,1,4],[1,4,2,4],[2,0,3,0],[2,1,2,2],[2,2,3,2],[2,3,2,4],[2,5,3,5],[3,1,3,2],[3,3,3,4],[3,4,4,4],[4,0,4,1],[4,1,4,2],[4,2,5,2],[4,3,4,4],[4,5,5,5],[5,0,5,1],[5,3,5,4]],
  // Maze 8
  [[0,0,1,0],[0,1,0,2],[0,3,0,4],[0,4,1,4],[1,1,1,2],[1,2,1,3],[1,3,2,3],[1,5,2,5],[2,0,2,1],[2,1,3,1],[2,2,2,3],[2,4,2,5],[3,0,3,1],[3,2,3,3],[3,3,4,3],[3,4,3,5],[4,0,4,1],[4,1,4,2],[4,2,5,2],[4,4,4,5],[4,4,5,4],[5,0,5,1],[5,2,5,3]],
];

// =============================================================================
// UI CONSTANTS
// =============================================================================

export const MODULE_ANIMATION_DURATION_MS = 300;
export const STRIKE_FLASH_DURATION_MS = 500;
