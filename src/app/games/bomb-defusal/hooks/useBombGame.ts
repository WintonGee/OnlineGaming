"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  GamePhase,
  Difficulty,
  BombState,
  ModuleState,
  WiresModuleState,
  ButtonModuleState,
  SimonSaysModuleState,
  MemoryModuleState,
  PasswordModuleState,
  MorseCodeModuleState,
  SimonColor,
  Edgework,
} from "../types";
import { DIFFICULTY_CONFIG, DEFAULT_DIFFICULTY, STORAGE_KEYS } from "../constants";
import { generateEdgework } from "../logic/edgework";
import { generateWires, cutWire } from "../logic/wiresLogic";
import {
  generateButtonModule,
  startHold,
  releaseButton,
  quickPress,
} from "../logic/buttonLogic";
import {
  generateSimonSaysModule,
  validateInput,
  addPlayerInput,
  advanceStage,
  startFlashing as startSimonFlashing,
  markSolved as markSimonSolved,
  handleStrike as handleSimonStrike,
} from "../logic/simonSaysLogic";
import { generateMemoryModule, pressButton as pressMemoryButton } from "../logic/memoryLogic";
import {
  generatePasswordModule,
  cycleUp,
  cycleDown,
  submitPassword,
} from "../logic/passwordLogic";
import {
  generateMorseCodeModule,
  incrementFrequency,
  decrementFrequency,
  setFrequency,
  submitFrequency,
  generateFlashSequence,
} from "../logic/morseCodeLogic";
import { useCountdownTimer } from "./useCountdownTimer";
import { createStorage } from "@/lib/utils/storage";

type ModuleType = "wires" | "button" | "simon-says" | "memory" | "password" | "morse-code";

interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  bestTime: Record<Difficulty, number | null>;
}

const gameStatsStorage = createStorage<GameStats>(STORAGE_KEYS.GAME_STATS);

const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  bestTime: { Easy: null, Medium: null, Hard: null },
};

/**
 * Generate modules based on difficulty and edgework
 */
function generateModules(difficulty: Difficulty, edgework: Edgework): ModuleState[] {
  const config = DIFFICULTY_CONFIG[difficulty];
  const moduleTypes: ModuleType[] = ["wires", "button", "simon-says", "memory", "password", "morse-code"];

  // Shuffle and pick module types
  const shuffled = [...moduleTypes].sort(() => Math.random() - 0.5);
  const selectedTypes = shuffled.slice(0, config.moduleCount);

  return selectedTypes.map((type) => {
    switch (type) {
      case "wires":
        return generateWires(edgework);
      case "button":
        return generateButtonModule(edgework);
      case "simon-says":
        return generateSimonSaysModule();
      case "memory":
        return generateMemoryModule();
      case "password":
        return generatePasswordModule();
      case "morse-code":
        return generateMorseCodeModule();
    }
  });
}

/**
 * Main bomb game hook
 */
export function useBombGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>(DEFAULT_DIFFICULTY);
  const [gamePhase, setGamePhase] = useState<GamePhase>("menu");
  const [bombState, setBombState] = useState<BombState | null>(null);
  const [stats, setStats] = useState<GameStats>(DEFAULT_STATS);
  const [selectedModuleIndex, setSelectedModuleIndex] = useState<number>(0);

  // Simon Says flash state
  const simonFlashTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Morse code flash state
  const morseFlashTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [morseIsOn, setMorseIsOn] = useState(false);
  const [morseFlashIndex, setMorseFlashIndex] = useState(0);

  const hasInitialized = useRef(false);

  // Ref to always access the latest bombState (avoids stale closures in timeouts)
  const bombStateRef = useRef<BombState | null>(null);
  bombStateRef.current = bombState;

  // Load stats on mount
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const saved = gameStatsStorage.load();
    if (saved) {
      setStats(saved);
    }
  }, []);

  // Handle time up
  const handleTimeUp = useCallback(() => {
    if (gamePhase === "playing" && bombState) {
      setGamePhase("exploded");
      setBombState((prev) => (prev ? { ...prev, isExploded: true } : null));
      updateStats(false);
    }
  }, [gamePhase, bombState]);

  const config = DIFFICULTY_CONFIG[difficulty];
  const timer = useCountdownTimer({
    initialSeconds: config.timerSeconds,
    onTimeUp: handleTimeUp,
  });

  // Update stats
  const updateStats = useCallback(
    (won: boolean) => {
      setStats((prev) => {
        const newStats = {
          ...prev,
          gamesPlayed: prev.gamesPlayed + 1,
          gamesWon: won ? prev.gamesWon + 1 : prev.gamesWon,
          bestTime: { ...prev.bestTime },
        };

        if (won && bombState) {
          const timeTaken = config.timerSeconds - timer.timeRemaining;
          const currentBest = newStats.bestTime[difficulty];
          if (currentBest === null || timeTaken < currentBest) {
            newStats.bestTime[difficulty] = timeTaken;
          }
        }

        gameStatsStorage.save(newStats);
        return newStats;
      });
    },
    [bombState, config.timerSeconds, timer.timeRemaining, difficulty]
  );

  // Start a new game
  const startGame = useCallback(
    (selectedDifficulty?: Difficulty) => {
      const diff = selectedDifficulty ?? difficulty;
      if (selectedDifficulty) {
        setDifficulty(selectedDifficulty);
      }

      const edgework = generateEdgework();
      const modules = generateModules(diff, edgework);

      setBombState({
        edgework,
        modules,
        strikes: 0,
        maxStrikes: DIFFICULTY_CONFIG[diff].maxStrikes,
        timerSeconds: DIFFICULTY_CONFIG[diff].timerSeconds,
        isDefused: false,
        isExploded: false,
      });

      setSelectedModuleIndex(0);
      setGamePhase("playing");
      timer.reset(DIFFICULTY_CONFIG[diff].timerSeconds);
      timer.start();
    },
    [difficulty, timer]
  );

  // Add a strike
  const addStrike = useCallback(() => {
    if (!bombState) return;

    const newStrikes = bombState.strikes + 1;

    if (newStrikes >= bombState.maxStrikes) {
      setGamePhase("exploded");
      setBombState((prev) => (prev ? { ...prev, strikes: newStrikes, isExploded: true } : null));
      timer.stop();
      updateStats(false);
    } else {
      setBombState((prev) => (prev ? { ...prev, strikes: newStrikes } : null));
    }
  }, [bombState, timer, updateStats]);

  // Check if all modules are solved
  const checkAllModulesSolved = useCallback(() => {
    if (!bombState) return false;
    return bombState.modules.every((m) => m.status === "solved");
  }, [bombState]);

  // Mark game as defused
  const defuseBomb = useCallback(() => {
    setGamePhase("defused");
    setBombState((prev) => (prev ? { ...prev, isDefused: true } : null));
    timer.stop();
    updateStats(true);
  }, [timer, updateStats]);

  // Update a specific module
  const updateModule = useCallback(
    (moduleId: string, updater: (module: ModuleState) => ModuleState) => {
      setBombState((prev) => {
        if (!prev) return null;
        const newModules = prev.modules.map((m) => (m.id === moduleId ? updater(m) : m));
        return { ...prev, modules: newModules };
      });
    },
    []
  );

  // --- Wires Module Actions ---
  const handleCutWire = useCallback(
    (moduleId: string, wireIndex: number) => {
      if (!bombState) return;
      const module = bombState.modules.find((m) => m.id === moduleId) as WiresModuleState;
      if (!module || module.status !== "unsolved") return;

      // wireIndex is 0-indexed from component, wire.position is 1-indexed
      const wirePosition = module.wires[wireIndex]?.position;
      if (!wirePosition) return;

      const { newState, isCorrect } = cutWire(module, wirePosition);
      updateModule(moduleId, () => ({ ...newState, status: isCorrect ? "solved" : "strike" }));

      if (!isCorrect) {
        addStrike();
        // Reset strike status after a moment
        setTimeout(() => {
          updateModule(moduleId, (m) => ({ ...m, status: "unsolved" }));
        }, 500);
      } else if (isCorrect) {
        // Check if all solved
        setTimeout(() => {
          if (checkAllModulesSolved()) {
            defuseBomb();
          }
        }, 100);
      }
    },
    [bombState, updateModule, addStrike, checkAllModulesSolved, defuseBomb]
  );

  // --- Button Module Actions ---
  const handleButtonPress = useCallback(
    (moduleId: string) => {
      if (!bombState) return;
      const module = bombState.modules.find((m) => m.id === moduleId) as ButtonModuleState;
      if (!module || module.status !== "unsolved") return;

      // Start hold - reveal strip color
      const newState = startHold(module);
      updateModule(moduleId, () => newState);
    },
    [bombState, updateModule]
  );

  const handleButtonRelease = useCallback(
    (moduleId: string) => {
      if (!bombState) return;
      const module = bombState.modules.find((m) => m.id === moduleId) as ButtonModuleState;
      if (!module || module.status !== "unsolved" || !module.isHolding) return;

      const holdDuration = module.holdStartTime ? Date.now() - module.holdStartTime : 0;

      // If held briefly (<300ms), treat as quick press
      if (holdDuration < 300) {
        const { newState, isCorrect } = quickPress(module);
        updateModule(moduleId, () => newState);

        if (!isCorrect) {
          addStrike();
          setTimeout(() => {
            updateModule(moduleId, (m) => ({ ...m, status: "unsolved", isHolding: false, stripColor: null }));
          }, 500);
        } else {
          setTimeout(() => {
            if (checkAllModulesSolved()) defuseBomb();
          }, 100);
        }
      } else {
        // Release after hold - check timing
        const { newState, isCorrect } = releaseButton(module, timer.timeRemaining);
        updateModule(moduleId, () => newState);

        if (!isCorrect) {
          addStrike();
          setTimeout(() => {
            updateModule(moduleId, (m) => ({ ...m, status: "unsolved", isHolding: false, stripColor: null }));
          }, 500);
        } else {
          setTimeout(() => {
            if (checkAllModulesSolved()) defuseBomb();
          }, 100);
        }
      }
    },
    [bombState, timer.timeRemaining, updateModule, addStrike, checkAllModulesSolved, defuseBomb]
  );

  // --- Simon Says Module Actions ---
  const startSimonSequence = useCallback(
    (moduleId: string) => {
      // Use ref to get latest bombState (avoids stale closure in setTimeout callbacks)
      const currentBombState = bombStateRef.current;
      if (!currentBombState) return;
      const module = currentBombState.modules.find((m) => m.id === moduleId) as SimonSaysModuleState;
      if (!module || module.status !== "unsolved") return;

      const newState = startSimonFlashing(module);
      updateModule(moduleId, () => newState);

      // Start flash animation - flash currentStage + 1 lights (stages are 0-indexed)
      const stageToFlash = newState.currentStage;
      const flashSequence = (index: number) => {
        if (index > stageToFlash) {
          // Done flashing, wait for player input
          updateModule(moduleId, (m) => ({
            ...(m as SimonSaysModuleState),
            isFlashing: false,
            currentFlashIndex: -1,
          }));
          return;
        }

        updateModule(moduleId, (m) => ({
          ...(m as SimonSaysModuleState),
          currentFlashIndex: index,
        }));

        simonFlashTimeoutRef.current = setTimeout(() => {
          flashSequence(index + 1);
        }, 800);
      };

      flashSequence(0);
    },
    [updateModule]
  );

  const handleSimonInput = useCallback(
    (moduleId: string, color: SimonColor) => {
      // Use ref to get latest bombState
      const currentBombState = bombStateRef.current;
      if (!currentBombState) return;
      const module = currentBombState.modules.find((m) => m.id === moduleId) as SimonSaysModuleState;
      if (!module || module.status !== "unsolved" || module.isFlashing) return;

      const { isCorrect, isStageComplete, isModuleSolved } = validateInput(
        module,
        color,
        currentBombState.edgework,
        currentBombState.strikes
      );

      if (!isCorrect) {
        const newState = handleSimonStrike(module);
        updateModule(moduleId, () => newState);
        addStrike();
        setTimeout(() => {
          updateModule(moduleId, (m) => ({ ...m, status: "unsolved" }));
          // Restart the sequence
          startSimonSequence(moduleId);
        }, 500);
      } else if (isModuleSolved) {
        const newState = markSimonSolved(module);
        updateModule(moduleId, () => newState);
        setTimeout(() => {
          if (checkAllModulesSolved()) defuseBomb();
        }, 100);
      } else if (isStageComplete) {
        const newState = advanceStage(addPlayerInput(module, color));
        updateModule(moduleId, () => newState);
        // Start next stage sequence
        setTimeout(() => startSimonSequence(moduleId), 500);
      } else {
        // Continue current stage
        updateModule(moduleId, () => addPlayerInput(module, color));
      }
    },
    [updateModule, addStrike, startSimonSequence, checkAllModulesSolved, defuseBomb]
  );

  // --- Memory Module Actions ---
  const handleMemoryPress = useCallback(
    (moduleId: string, position: 1 | 2 | 3 | 4) => {
      if (!bombState) return;
      const module = bombState.modules.find((m) => m.id === moduleId) as MemoryModuleState;
      if (!module || module.status !== "unsolved") return;

      const { newState, isCorrect, isModuleSolved } = pressMemoryButton(module, position);
      updateModule(moduleId, () => newState);

      if (!isCorrect) {
        addStrike();
        setTimeout(() => {
          updateModule(moduleId, (m) => ({ ...m, status: "unsolved" }));
        }, 500);
      } else if (isModuleSolved) {
        setTimeout(() => {
          if (checkAllModulesSolved()) defuseBomb();
        }, 100);
      }
    },
    [bombState, updateModule, addStrike, checkAllModulesSolved, defuseBomb]
  );

  // --- Password Module Actions ---
  const handlePasswordCycleUp = useCallback(
    (moduleId: string, columnIndex: number) => {
      if (!bombState) return;
      const module = bombState.modules.find((m) => m.id === moduleId) as PasswordModuleState;
      if (!module || module.status !== "unsolved") return;

      const newState = cycleUp(module, columnIndex);
      updateModule(moduleId, () => newState);
    },
    [bombState, updateModule]
  );

  const handlePasswordCycleDown = useCallback(
    (moduleId: string, columnIndex: number) => {
      if (!bombState) return;
      const module = bombState.modules.find((m) => m.id === moduleId) as PasswordModuleState;
      if (!module || module.status !== "unsolved") return;

      const newState = cycleDown(module, columnIndex);
      updateModule(moduleId, () => newState);
    },
    [bombState, updateModule]
  );

  const handlePasswordSubmit = useCallback(
    (moduleId: string) => {
      if (!bombState) return;
      const module = bombState.modules.find((m) => m.id === moduleId) as PasswordModuleState;
      if (!module || module.status !== "unsolved") return;

      const { newState, isCorrect } = submitPassword(module);
      updateModule(moduleId, () => newState);

      if (!isCorrect) {
        addStrike();
        setTimeout(() => {
          updateModule(moduleId, (m) => ({ ...m, status: "unsolved" }));
        }, 500);
      } else {
        setTimeout(() => {
          if (checkAllModulesSolved()) defuseBomb();
        }, 100);
      }
    },
    [bombState, updateModule, addStrike, checkAllModulesSolved, defuseBomb]
  );

  // --- Morse Code Module Actions ---
  const handleMorseFrequencyUp = useCallback(
    (moduleId: string) => {
      if (!bombState) return;
      const module = bombState.modules.find((m) => m.id === moduleId) as MorseCodeModuleState;
      if (!module || module.status !== "unsolved") return;

      const newState = incrementFrequency(module);
      updateModule(moduleId, () => newState);
    },
    [bombState, updateModule]
  );

  const handleMorseFrequencyDown = useCallback(
    (moduleId: string) => {
      if (!bombState) return;
      const module = bombState.modules.find((m) => m.id === moduleId) as MorseCodeModuleState;
      if (!module || module.status !== "unsolved") return;

      const newState = decrementFrequency(module);
      updateModule(moduleId, () => newState);
    },
    [bombState, updateModule]
  );

  const handleMorseFrequencySet = useCallback(
    (moduleId: string, frequency: number) => {
      if (!bombState) return;
      const module = bombState.modules.find((m) => m.id === moduleId) as MorseCodeModuleState;
      if (!module || module.status !== "unsolved") return;

      const newState = setFrequency(module, frequency);
      updateModule(moduleId, () => newState);
    },
    [bombState, updateModule]
  );

  const handleMorseSubmit = useCallback(
    (moduleId: string) => {
      if (!bombState) return;
      const module = bombState.modules.find((m) => m.id === moduleId) as MorseCodeModuleState;
      if (!module || module.status !== "unsolved") return;

      const { newState, isCorrect } = submitFrequency(module);
      updateModule(moduleId, () => newState);

      if (!isCorrect) {
        addStrike();
        setTimeout(() => {
          updateModule(moduleId, (m) => ({ ...m, status: "unsolved" }));
        }, 500);
      } else {
        setTimeout(() => {
          if (checkAllModulesSolved()) defuseBomb();
        }, 100);
      }
    },
    [bombState, updateModule, addStrike, checkAllModulesSolved, defuseBomb]
  );

  // Morse code flash animation
  useEffect(() => {
    if (!bombState) return;

    const morseModule = bombState.modules.find((m) => m.type === "morse-code") as MorseCodeModuleState | undefined;
    if (!morseModule || morseModule.status === "solved" || gamePhase !== "playing") {
      setMorseIsOn(false);
      return;
    }

    const sequence = generateFlashSequence(morseModule.word);
    if (sequence.length === 0) return;

    const runFlash = () => {
      const item = sequence[morseFlashIndex % sequence.length];
      setMorseIsOn(item.isOn);

      morseFlashTimeoutRef.current = setTimeout(() => {
        setMorseFlashIndex((prev) => (prev + 1) % sequence.length);
      }, item.duration);
    };

    runFlash();

    return () => {
      if (morseFlashTimeoutRef.current) {
        clearTimeout(morseFlashTimeoutRef.current);
      }
    };
  }, [bombState, morseFlashIndex, gamePhase]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (simonFlashTimeoutRef.current) clearTimeout(simonFlashTimeoutRef.current);
      if (morseFlashTimeoutRef.current) clearTimeout(morseFlashTimeoutRef.current);
    };
  }, []);

  // Return to menu
  const returnToMenu = useCallback(() => {
    setGamePhase("menu");
    setBombState(null);
    timer.reset();
    setMorseFlashIndex(0);
    setMorseIsOn(false);
  }, [timer]);

  return {
    // State
    gamePhase,
    difficulty,
    bombState,
    stats,
    selectedModuleIndex,
    timeRemaining: timer.timeRemaining,
    formattedTime: timer.formattedTime,
    morseIsOn,

    // Actions
    setDifficulty,
    startGame,
    returnToMenu,
    setSelectedModuleIndex,

    // Module actions
    handleCutWire,
    handleButtonPress,
    handleButtonRelease,
    startSimonSequence,
    handleSimonInput,
    handleMemoryPress,
    handlePasswordCycleUp,
    handlePasswordCycleDown,
    handlePasswordSubmit,
    handleMorseFrequencyUp,
    handleMorseFrequencyDown,
    handleMorseFrequencySet,
    handleMorseSubmit,
  };
}
