import { ComboState, WeaponType, Player } from "../types";
import {
  COMBO_DECAY_DELAY,
  COMBO_DECAY_RATE,
  COMBO_MULTIPLIER_THRESHOLDS,
  WEAPON_DEFINITIONS,
  WEAPON_ORDER,
} from "../constants";

export function createInitialComboState(): ComboState {
  return {
    currentCombo: 0,
    multiplier: 1,
    lastKillAt: 0,
    decayRate: COMBO_DECAY_RATE,
    highestCombo: 0,
  };
}

export function addToCombo(combo: ComboState, kills: number): ComboState {
  const newCombo = combo.currentCombo + kills;
  const newMultiplier = calculateMultiplier(newCombo);

  return {
    ...combo,
    currentCombo: newCombo,
    multiplier: newMultiplier,
    lastKillAt: Date.now(),
    highestCombo: Math.max(combo.highestCombo, newCombo),
  };
}

export function updateComboDecay(
  combo: ComboState,
  deltaTime: number
): ComboState {
  if (combo.currentCombo === 0) return combo;

  const now = Date.now();
  const timeSinceLastKill = now - combo.lastKillAt;

  // Don't decay during grace period
  if (timeSinceLastKill < COMBO_DECAY_DELAY) {
    return combo;
  }

  // Decay combo
  const decayAmount = combo.decayRate * (deltaTime / 1000);
  const newCombo = Math.max(0, combo.currentCombo - decayAmount);
  const newMultiplier = calculateMultiplier(Math.floor(newCombo));

  return {
    ...combo,
    currentCombo: newCombo,
    multiplier: newMultiplier,
  };
}

export function calculateMultiplier(combo: number): number {
  let multiplier = 1;

  for (const threshold of COMBO_MULTIPLIER_THRESHOLDS) {
    if (combo >= threshold.combo) {
      multiplier = threshold.multiplier;
    } else {
      break;
    }
  }

  return multiplier;
}

export function getNextWeaponUnlock(
  combo: number,
  unlockedWeapons: Set<WeaponType>
): WeaponType | null {
  for (const weaponType of WEAPON_ORDER) {
    if (unlockedWeapons.has(weaponType)) continue;

    const definition = WEAPON_DEFINITIONS[weaponType];
    if (combo >= definition.unlockCombo) {
      return weaponType;
    }
  }

  return null;
}

export function checkWeaponUnlocks(
  combo: number,
  unlockedWeapons: Set<WeaponType>
): WeaponType[] {
  const newUnlocks: WeaponType[] = [];

  for (const weaponType of WEAPON_ORDER) {
    if (unlockedWeapons.has(weaponType)) continue;

    const definition = WEAPON_DEFINITIONS[weaponType];
    if (combo >= definition.unlockCombo) {
      newUnlocks.push(weaponType);
    }
  }

  return newUnlocks;
}

export function getComboProgress(
  combo: number,
  unlockedWeapons: Set<WeaponType>
): {
  nextWeapon: WeaponType | null;
  comboNeeded: number;
  progress: number;
} {
  // Find the next weapon to unlock
  let nextWeapon: WeaponType | null = null;
  let comboNeeded = 0;

  for (const weaponType of WEAPON_ORDER) {
    if (unlockedWeapons.has(weaponType)) continue;

    const definition = WEAPON_DEFINITIONS[weaponType];
    nextWeapon = weaponType;
    comboNeeded = definition.unlockCombo;
    break;
  }

  if (!nextWeapon) {
    return { nextWeapon: null, comboNeeded: 0, progress: 100 };
  }

  // Find previous weapon's unlock threshold
  const weaponIndex = WEAPON_ORDER.indexOf(nextWeapon);
  let previousThreshold = 0;
  if (weaponIndex > 0) {
    const prevWeapon = WEAPON_ORDER[weaponIndex - 1];
    previousThreshold = WEAPON_DEFINITIONS[prevWeapon].unlockCombo;
  }

  const progressRange = comboNeeded - previousThreshold;
  const currentProgress = combo - previousThreshold;
  const progress = Math.min(100, (currentProgress / progressRange) * 100);

  return { nextWeapon, comboNeeded, progress };
}

export function formatCombo(combo: number): string {
  return Math.floor(combo).toString();
}
