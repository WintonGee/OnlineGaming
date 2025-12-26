import { KeypadsModuleState, KeypadSymbol, KeypadButton } from "../types";
import { KEYPAD_COLUMNS } from "../constants";

/**
 * Generate a new Keypads module
 * Randomly selects a column and picks 4 symbols from it
 */
export function generateKeypadsModule(): KeypadsModuleState {
  // Pick a random column (0-5)
  const columnIndex = Math.floor(Math.random() * KEYPAD_COLUMNS.length);
  const column = KEYPAD_COLUMNS[columnIndex];

  // Pick 4 random symbols from this column
  const shuffledColumn = [...column].sort(() => Math.random() - 0.5);
  const selectedSymbols = shuffledColumn.slice(0, 4);

  // The correct order is their order in the original column
  const correctOrder = selectedSymbols
    .map((symbol, displayIndex) => ({
      symbol,
      displayIndex,
      columnIndex: column.indexOf(symbol),
    }))
    .sort((a, b) => a.columnIndex - b.columnIndex)
    .map((item) => item.displayIndex);

  // Create buttons in shuffled order (as displayed to user)
  const buttons: KeypadButton[] = selectedSymbols.map((symbol, index) => ({
    symbol,
    pressed: false,
    position: index,
  }));

  return {
    id: `keypads-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: "keypads",
    status: "unsolved",
    buttons,
    correctOrder,
    currentPressIndex: 0,
  };
}

/**
 * Handle pressing a keypad button
 */
export function pressKeypad(
  module: KeypadsModuleState,
  buttonPosition: number
): { newState: KeypadsModuleState; isCorrect: boolean; isModuleSolved: boolean } {
  const expectedPosition = module.correctOrder[module.currentPressIndex];
  const isCorrect = buttonPosition === expectedPosition;

  if (!isCorrect) {
    // Wrong button - reset all buttons and progress
    return {
      newState: {
        ...module,
        status: "strike",
        buttons: module.buttons.map((b) => ({ ...b, pressed: false })),
        currentPressIndex: 0,
      },
      isCorrect: false,
      isModuleSolved: false,
    };
  }

  // Correct button - mark as pressed and advance
  const newButtons = module.buttons.map((b) =>
    b.position === buttonPosition ? { ...b, pressed: true } : b
  );
  const newPressIndex = module.currentPressIndex + 1;
  const isModuleSolved = newPressIndex >= 4;

  return {
    newState: {
      ...module,
      status: isModuleSolved ? "solved" : "unsolved",
      buttons: newButtons,
      currentPressIndex: newPressIndex,
    },
    isCorrect: true,
    isModuleSolved,
  };
}

/**
 * Get the display character for a keypad symbol
 */
export function getSymbolDisplay(symbol: KeypadSymbol): string {
  const symbolMap: Record<KeypadSymbol, string> = {
    copyright: "©",
    filledStar: "★",
    hollowStar: "☆",
    smiley: "ツ",
    doublek: "Ж",
    omega: "Ω",
    squidknife: "Ͽ",
    pumpkin: "Ѣ",
    hookn: "ƛ",
    six: "б",
    squigglyn: "Ҩ",
    at: "Ѧ",
    ae: "Æ",
    meltedthree: "Ӭ",
    euro: "€",
    nwithhat: "Ñ",
    dragon: "Ψ",
    questionmark: "¿",
    paragraph: "¶",
    rightc: "Ͼ",
    leftc: "Ͻ",
    pitchfork: "Ѱ",
    cursive: "ϗ",
    tracks: "҂",
    balloon: "Ϙ",
    upsidedowny: "ʎ",
    bt: "Ѯ",
  };
  return symbolMap[symbol] || "?";
}
