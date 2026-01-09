"use client";

import { useState, useEffect, useCallback } from "react";
import { PlayerInput, InputState, GameMode } from "../types";

function createEmptyInput(): PlayerInput {
  return {
    moveUp: false,
    moveDown: false,
    moveLeft: false,
    moveRight: false,
    shoot: false,
    cycleWeaponNext: false,
    cycleWeaponPrev: false,
    activateChargePack: false,
  };
}

// Player 1: Arrow keys + / to shoot + ,/. for weapons
const PLAYER1_KEYS = {
  moveUp: ["ArrowUp"],
  moveDown: ["ArrowDown"],
  moveLeft: ["ArrowLeft"],
  moveRight: ["ArrowRight"],
  shoot: ["Slash"], // / key
  cycleWeaponNext: ["Period"], // .
  cycleWeaponPrev: ["Comma"], // ,
  activateChargePack: ["Digit1"],
};

// Player 2: WASD + Space to shoot + Q/E for weapons
const PLAYER2_KEYS = {
  moveUp: ["KeyW"],
  moveDown: ["KeyS"],
  moveLeft: ["KeyA"],
  moveRight: ["KeyD"],
  shoot: ["Space"],
  cycleWeaponNext: ["KeyE"],
  cycleWeaponPrev: ["KeyQ"],
  activateChargePack: ["Digit2"],
};

const GAME_KEYS = new Set([
  ...Object.values(PLAYER1_KEYS).flat(),
  ...Object.values(PLAYER2_KEYS).flat(),
  "KeyP", // Pause
]);

export function useMultiplayerInput(
  enabled: boolean,
  mode: GameMode
): {
  inputState: InputState;
  resetInput: () => void;
  isPausePressed: boolean;
} {
  const [inputState, setInputState] = useState<InputState>({
    player1: createEmptyInput(),
    player2: createEmptyInput(),
  });
  const [isPausePressed, setIsPausePressed] = useState(false);

  const resetInput = useCallback(() => {
    setInputState({
      player1: createEmptyInput(),
      player2: createEmptyInput(),
    });
  }, []);

  useEffect(() => {
    if (!enabled) {
      resetInput();
      return;
    }

    const pressedKeys = new Set<string>();
    const weaponCycleHandled = { player1Next: false, player1Prev: false, player2Next: false, player2Prev: false };

    const updateInputState = () => {
      setInputState({
        player1: {
          moveUp: PLAYER1_KEYS.moveUp.some((k) => pressedKeys.has(k)),
          moveDown: PLAYER1_KEYS.moveDown.some((k) => pressedKeys.has(k)),
          moveLeft: PLAYER1_KEYS.moveLeft.some((k) => pressedKeys.has(k)),
          moveRight: PLAYER1_KEYS.moveRight.some((k) => pressedKeys.has(k)),
          shoot: PLAYER1_KEYS.shoot.some((k) => pressedKeys.has(k)),
          cycleWeaponNext:
            PLAYER1_KEYS.cycleWeaponNext.some((k) => pressedKeys.has(k)) &&
            !weaponCycleHandled.player1Next,
          cycleWeaponPrev:
            PLAYER1_KEYS.cycleWeaponPrev.some((k) => pressedKeys.has(k)) &&
            !weaponCycleHandled.player1Prev,
          activateChargePack: PLAYER1_KEYS.activateChargePack.some((k) =>
            pressedKeys.has(k)
          ),
        },
        player2:
          mode !== "single"
            ? {
                moveUp: PLAYER2_KEYS.moveUp.some((k) => pressedKeys.has(k)),
                moveDown: PLAYER2_KEYS.moveDown.some((k) => pressedKeys.has(k)),
                moveLeft: PLAYER2_KEYS.moveLeft.some((k) => pressedKeys.has(k)),
                moveRight: PLAYER2_KEYS.moveRight.some((k) =>
                  pressedKeys.has(k)
                ),
                shoot: PLAYER2_KEYS.shoot.some((k) => pressedKeys.has(k)),
                cycleWeaponNext:
                  PLAYER2_KEYS.cycleWeaponNext.some((k) =>
                    pressedKeys.has(k)
                  ) && !weaponCycleHandled.player2Next,
                cycleWeaponPrev:
                  PLAYER2_KEYS.cycleWeaponPrev.some((k) =>
                    pressedKeys.has(k)
                  ) && !weaponCycleHandled.player2Prev,
                activateChargePack: PLAYER2_KEYS.activateChargePack.some((k) =>
                  pressedKeys.has(k)
                ),
              }
            : createEmptyInput(),
      });

      // Mark weapon cycle as handled to prevent rapid cycling
      if (PLAYER1_KEYS.cycleWeaponNext.some((k) => pressedKeys.has(k))) {
        weaponCycleHandled.player1Next = true;
      }
      if (PLAYER1_KEYS.cycleWeaponPrev.some((k) => pressedKeys.has(k))) {
        weaponCycleHandled.player1Prev = true;
      }
      if (PLAYER2_KEYS.cycleWeaponNext.some((k) => pressedKeys.has(k))) {
        weaponCycleHandled.player2Next = true;
      }
      if (PLAYER2_KEYS.cycleWeaponPrev.some((k) => pressedKeys.has(k))) {
        weaponCycleHandled.player2Prev = true;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for game keys
      if (GAME_KEYS.has(e.code)) {
        e.preventDefault();
      }

      // Handle pause separately
      if (e.code === "KeyP") {
        setIsPausePressed(true);
        return;
      }

      pressedKeys.add(e.code);
      updateInputState();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      pressedKeys.delete(e.code);

      // Reset weapon cycle handling on key up
      if (PLAYER1_KEYS.cycleWeaponNext.includes(e.code)) {
        weaponCycleHandled.player1Next = false;
      }
      if (PLAYER1_KEYS.cycleWeaponPrev.includes(e.code)) {
        weaponCycleHandled.player1Prev = false;
      }
      if (PLAYER2_KEYS.cycleWeaponNext.includes(e.code)) {
        weaponCycleHandled.player2Next = false;
      }
      if (PLAYER2_KEYS.cycleWeaponPrev.includes(e.code)) {
        weaponCycleHandled.player2Prev = false;
      }

      if (e.code === "KeyP") {
        setIsPausePressed(false);
      }

      updateInputState();
    };

    // Handle window blur (reset all inputs when window loses focus)
    const handleBlur = () => {
      pressedKeys.clear();
      resetInput();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [enabled, mode, resetInput]);

  return { inputState, resetInput, isPausePressed };
}
