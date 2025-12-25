// Wires module logic for bomb defusal game

import { Wire, WireColor, WiresModuleState, Edgework } from "../types";
import { WIRE_COLORS, MIN_WIRES, MAX_WIRES } from "../constants";

/**
 * Count wires of a specific color
 */
export function countWiresByColor(wires: Wire[], color: WireColor): number {
  return wires.filter((w) => w.color === color && !w.cut).length;
}

/**
 * Get the last wire of a specific color (1-indexed position)
 */
export function getLastWireOfColor(wires: Wire[], color: WireColor): number {
  for (let i = wires.length - 1; i >= 0; i--) {
    if (wires[i].color === color && !wires[i].cut) {
      return i + 1; // 1-indexed
    }
  }
  return -1;
}

/**
 * Determine which wire to cut for 3 wires
 */
function determineCorrectWire3(wires: Wire[], _edgework: Edgework): number {
  const redCount = countWiresByColor(wires, "red");
  const blueCount = countWiresByColor(wires, "blue");
  const lastWire = wires[wires.length - 1];

  // No red wires -> cut 2nd wire
  if (redCount === 0) {
    return 2;
  }

  // Last wire is white -> cut last wire
  if (lastWire.color === "white") {
    return wires.length;
  }

  // More than 1 blue wire -> cut last blue wire
  if (blueCount > 1) {
    return getLastWireOfColor(wires, "blue");
  }

  // Otherwise -> cut last wire
  return wires.length;
}

/**
 * Determine which wire to cut for 4 wires
 */
function determineCorrectWire4(wires: Wire[], edgework: Edgework): number {
  const redCount = countWiresByColor(wires, "red");
  const blueCount = countWiresByColor(wires, "blue");
  const yellowCount = countWiresByColor(wires, "yellow");
  const lastWire = wires[wires.length - 1];
  const serialOdd = edgework.serialNumber.lastDigitOdd;

  // Multiple red AND serial odd -> cut last red
  if (redCount > 1 && serialOdd) {
    return getLastWireOfColor(wires, "red");
  }

  // Last wire yellow AND no red -> cut 1st wire
  if (lastWire.color === "yellow" && redCount === 0) {
    return 1;
  }

  // Exactly 1 blue -> cut 1st wire
  if (blueCount === 1) {
    return 1;
  }

  // Multiple yellow -> cut last wire
  if (yellowCount > 1) {
    return wires.length;
  }

  // Otherwise -> cut 2nd wire
  return 2;
}

/**
 * Determine which wire to cut for 5 wires
 */
function determineCorrectWire5(wires: Wire[], edgework: Edgework): number {
  const redCount = countWiresByColor(wires, "red");
  const yellowCount = countWiresByColor(wires, "yellow");
  const blackCount = countWiresByColor(wires, "black");
  const lastWire = wires[wires.length - 1];
  const serialOdd = edgework.serialNumber.lastDigitOdd;

  // Last wire black AND serial odd -> cut 4th wire
  if (lastWire.color === "black" && serialOdd) {
    return 4;
  }

  // Exactly 1 red AND multiple yellow -> cut 1st wire
  if (redCount === 1 && yellowCount > 1) {
    return 1;
  }

  // No black wires -> cut 2nd wire
  if (blackCount === 0) {
    return 2;
  }

  // Otherwise -> cut 1st wire
  return 1;
}

/**
 * Determine which wire to cut for 6 wires
 */
function determineCorrectWire6(wires: Wire[], edgework: Edgework): number {
  const redCount = countWiresByColor(wires, "red");
  const yellowCount = countWiresByColor(wires, "yellow");
  const whiteCount = countWiresByColor(wires, "white");
  const serialOdd = edgework.serialNumber.lastDigitOdd;

  // No yellow AND serial odd -> cut 3rd wire
  if (yellowCount === 0 && serialOdd) {
    return 3;
  }

  // Exactly 1 yellow AND multiple white -> cut 4th wire
  if (yellowCount === 1 && whiteCount > 1) {
    return 4;
  }

  // No red wires -> cut last wire
  if (redCount === 0) {
    return 6;
  }

  // Otherwise -> cut 4th wire
  return 4;
}

/**
 * Determine which wire to cut based on wire configuration and edgework
 */
export function determineCorrectWire(wires: Wire[], edgework: Edgework): number {
  const wireCount = wires.length;

  switch (wireCount) {
    case 3:
      return determineCorrectWire3(wires, edgework);
    case 4:
      return determineCorrectWire4(wires, edgework);
    case 5:
      return determineCorrectWire5(wires, edgework);
    case 6:
      return determineCorrectWire6(wires, edgework);
    default:
      throw new Error(`Invalid wire count: ${wireCount}`);
  }
}

/**
 * Generate a random wire color
 */
function getRandomColor(): WireColor {
  return WIRE_COLORS[Math.floor(Math.random() * WIRE_COLORS.length)];
}

/**
 * Generate wires for the module
 */
export function generateWires(edgework: Edgework): WiresModuleState {
  const wireCount = MIN_WIRES + Math.floor(Math.random() * (MAX_WIRES - MIN_WIRES + 1));

  const wires: Wire[] = Array.from({ length: wireCount }, (_, i) => ({
    color: getRandomColor(),
    cut: false,
    position: i + 1,
  }));

  const correctWirePosition = determineCorrectWire(wires, edgework);

  return {
    id: `wires-${Date.now()}`,
    type: "wires",
    status: "unsolved",
    wires,
    correctWirePosition,
  };
}

/**
 * Process a wire cut action
 */
export function cutWire(
  state: WiresModuleState,
  position: number
): { newState: WiresModuleState; isCorrect: boolean } {
  // Find the wire
  const wireIndex = state.wires.findIndex((w) => w.position === position);
  if (wireIndex === -1 || state.wires[wireIndex].cut) {
    return { newState: state, isCorrect: false };
  }

  // Mark wire as cut
  const newWires = state.wires.map((wire, idx) =>
    idx === wireIndex ? { ...wire, cut: true } : wire
  );

  const isCorrect = position === state.correctWirePosition;

  return {
    newState: {
      ...state,
      wires: newWires,
      status: isCorrect ? "solved" : "strike",
    },
    isCorrect,
  };
}
