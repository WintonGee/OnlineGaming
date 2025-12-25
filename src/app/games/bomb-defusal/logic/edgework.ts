// Edgework generation logic for bomb defusal game

import {
  Edgework,
  SerialNumber,
  Indicator,
  IndicatorLabel,
  PortType,
} from "../types";
import {
  INDICATOR_LABELS,
  PORT_TYPES,
  SERIAL_VOWELS,
  SERIAL_CHARACTERS,
  SERIAL_LENGTH,
} from "../constants";

/**
 * Generate a random character from the allowed set
 */
function getRandomChar(): string {
  return SERIAL_CHARACTERS[Math.floor(Math.random() * SERIAL_CHARACTERS.length)];
}

/**
 * Generate a serial number with the format: 2 letters + digit + 2 letters + digit
 * Example: "AB3CD5"
 */
export function generateSerialNumber(): SerialNumber {
  let value = "";

  // Generate 6 characters
  for (let i = 0; i < SERIAL_LENGTH; i++) {
    value += getRandomChar();
  }

  // Ensure last character is a digit
  const lastDigit = Math.floor(Math.random() * 10).toString();
  value = value.slice(0, -1) + lastDigit;

  const lastDigitOdd = parseInt(lastDigit, 10) % 2 === 1;
  const hasVowel = SERIAL_VOWELS.some((v) => value.includes(v));

  return {
    value,
    lastDigitOdd,
    hasVowel,
  };
}

/**
 * Generate random indicators (0-3)
 */
export function generateIndicators(count?: number): Indicator[] {
  const indicatorCount = count ?? Math.floor(Math.random() * 4);
  const availableLabels = [...INDICATOR_LABELS];
  const indicators: Indicator[] = [];

  for (let i = 0; i < indicatorCount && availableLabels.length > 0; i++) {
    const labelIndex = Math.floor(Math.random() * availableLabels.length);
    const label = availableLabels.splice(labelIndex, 1)[0];

    indicators.push({
      label,
      lit: Math.random() > 0.5,
    });
  }

  return indicators;
}

/**
 * Generate random battery count (0-6)
 */
export function generateBatteries(): { batteries: number; holders: number } {
  const batteries = Math.floor(Math.random() * 7);
  // AA holders have 2, D holders have 1
  // Simplified: assume roughly half AA, half D
  const holders = Math.ceil(batteries / 2);

  return { batteries, holders };
}

/**
 * Generate random ports (0-6)
 */
export function generatePorts(): PortType[] {
  const portCount = Math.floor(Math.random() * 4);
  const ports: PortType[] = [];

  for (let i = 0; i < portCount; i++) {
    const portIndex = Math.floor(Math.random() * PORT_TYPES.length);
    ports.push(PORT_TYPES[portIndex] as PortType);
  }

  return ports;
}

/**
 * Generate complete edgework for a bomb
 */
export function generateEdgework(): Edgework {
  const serialNumber = generateSerialNumber();
  const { batteries, holders } = generateBatteries();
  const indicators = generateIndicators();
  const ports = generatePorts();

  return {
    serialNumber,
    batteries,
    batteryHolders: holders,
    indicators,
    ports,
  };
}

/**
 * Check if a specific indicator is lit
 */
export function hasLitIndicator(edgework: Edgework, label: IndicatorLabel): boolean {
  return edgework.indicators.some((ind) => ind.label === label && ind.lit);
}

/**
 * Check if bomb has a parallel port
 */
export function hasParallelPort(edgework: Edgework): boolean {
  return edgework.ports.includes("Parallel");
}

/**
 * Check if bomb has a serial port
 */
export function hasSerialPort(edgework: Edgework): boolean {
  return edgework.ports.includes("Serial");
}

/**
 * Get total battery count
 */
export function getBatteryCount(edgework: Edgework): number {
  return edgework.batteries;
}
