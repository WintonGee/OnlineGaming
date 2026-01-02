"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  GameState,
  TestConfig,
  PersonalBests,
  SavedGameState,
  TestResult,
} from "../types";
import {
  DEFAULT_CONFIG,
  TYPING_TEST_CONFIG_KEY,
  TYPING_TEST_BESTS_KEY,
  WPM_SAMPLE_INTERVAL,
} from "../constants";
import { createStorage } from "@/lib/utils/storage";
import {
  createNewGame,
  processCharacter,
  handleBackspace as processBackspace,
  calculateStats,
  calculateConsistency,
  isTestComplete,
} from "../logic/game";

// Create storage instances at module level
const configStorage = createStorage<SavedGameState>(TYPING_TEST_CONFIG_KEY);
const bestsStorage = createStorage<PersonalBests>(TYPING_TEST_BESTS_KEY);

// Default personal bests structure
const DEFAULT_PERSONAL_BESTS: PersonalBests = {
  time: {},
  words: {},
};

export function useTypingTestGameState() {
  // Mounted state for hydration safety
  const [mounted, setMounted] = useState(false);

  // Core game state
  const [gameState, setGameState] = useState<GameState>(() =>
    createNewGame(DEFAULT_CONFIG)
  );

  // Personal bests
  const [personalBests, setPersonalBests] = useState<PersonalBests>(
    DEFAULT_PERSONAL_BESTS
  );

  // Test configuration
  const [testConfig, setTestConfig] = useState<TestConfig>(DEFAULT_CONFIG);

  // Refs for intervals
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const wpmSampleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved config and personal bests on mount
  useEffect(() => {
    const savedState = configStorage.load();
    const savedBests = bestsStorage.load();

    if (savedState?.config) {
      setTestConfig(savedState.config);
      setGameState(createNewGame(savedState.config));
    }

    if (savedBests) {
      setPersonalBests(savedBests);
    }

    setMounted(true);
  }, []);

  // Save config changes
  useEffect(() => {
    if (!mounted) return;

    const savedState: SavedGameState = {
      config: testConfig,
      personalBests,
    };
    configStorage.save(savedState);
  }, [testConfig, personalBests, mounted]);

  // Update elapsed time while test is active
  useEffect(() => {
    if (gameState.isActive && gameState.startTime && !gameState.isComplete) {
      timerIntervalRef.current = setInterval(() => {
        setGameState((prev) => {
          if (!prev.startTime || prev.isComplete) return prev;

          const elapsedTime = (Date.now() - prev.startTime) / 1000;

          // Check if test should end (time mode)
          if (prev.config.mode === "time" && elapsedTime >= prev.config.timeLimit) {
            return {
              ...prev,
              elapsedTime: prev.config.timeLimit,
              isComplete: true,
              isActive: false,
              endTime: Date.now(),
              stats: calculateStats({ ...prev, elapsedTime: prev.config.timeLimit }),
            };
          }

          return {
            ...prev,
            elapsedTime,
            stats: calculateStats({ ...prev, elapsedTime }),
          };
        });
      }, 100);

      return () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
      };
    }
  }, [gameState.isActive, gameState.startTime, gameState.isComplete]);

  // Sample WPM for consistency calculation
  useEffect(() => {
    if (gameState.isActive && gameState.startTime && !gameState.isComplete) {
      wpmSampleIntervalRef.current = setInterval(() => {
        setGameState((prev) => {
          if (!prev.startTime || prev.isComplete) return prev;

          const currentWpm = prev.stats.wpm;
          // Only record non-zero WPM samples
          if (currentWpm > 0) {
            const newWpmHistory = [...prev.wpmHistory, currentWpm];
            const consistency = calculateConsistency(newWpmHistory);

            return {
              ...prev,
              wpmHistory: newWpmHistory,
              stats: {
                ...prev.stats,
                consistency,
              },
            };
          }

          return prev;
        });
      }, WPM_SAMPLE_INTERVAL);

      return () => {
        if (wpmSampleIntervalRef.current) {
          clearInterval(wpmSampleIntervalRef.current);
          wpmSampleIntervalRef.current = null;
        }
      };
    }
  }, [gameState.isActive, gameState.startTime, gameState.isComplete]);

  // Auto-end test when time runs out (time mode) or words complete (words mode)
  useEffect(() => {
    if (gameState.isActive && isTestComplete(gameState) && !gameState.isComplete) {
      setGameState((prev) => ({
        ...prev,
        isComplete: true,
        isActive: false,
        endTime: Date.now(),
      }));
    }
  }, [gameState]);

  // Process a typed character
  const handleCharacterInput = useCallback((char: string) => {
    setGameState((prev) => {
      if (prev.isComplete) return prev;
      return processCharacter(prev, char);
    });
  }, []);

  // Remove last character
  const handleBackspace = useCallback(() => {
    setGameState((prev) => {
      if (prev.isComplete) return prev;
      return processBackspace(prev);
    });
  }, []);

  // Begin the test (start timer)
  const startTest = useCallback(() => {
    setGameState((prev) => {
      if (prev.isActive || prev.isComplete) return prev;
      return {
        ...prev,
        startTime: Date.now(),
        isActive: true,
      };
    });
  }, []);

  // End test and save results if better than personal best
  const endTest = useCallback(() => {
    setGameState((prev) => {
      if (!prev.isActive) return prev;

      const finalState: GameState = {
        ...prev,
        isComplete: true,
        isActive: false,
        endTime: Date.now(),
      };

      // Get test result
      const result = getTestResultFromState(finalState);

      // Update personal bests if this result is better
      setPersonalBests((currentBests) => {
        const newBests = updatePersonalBests(currentBests, result);
        bestsStorage.save(newBests);
        return newBests;
      });

      return finalState;
    });
  }, []);

  // Reset to a new test with same config
  const resetTest = useCallback(() => {
    // Clear intervals
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (wpmSampleIntervalRef.current) {
      clearInterval(wpmSampleIntervalRef.current);
      wpmSampleIntervalRef.current = null;
    }

    setGameState(createNewGame(testConfig));
  }, [testConfig]);

  // Update test settings
  const updateConfig = useCallback((config: Partial<TestConfig>) => {
    setTestConfig((prev) => {
      const newConfig = { ...prev, ...config };

      // Reset game with new config
      setGameState(createNewGame(newConfig));

      return newConfig;
    });
  }, []);

  // Get current result for display
  const getTestResult = useCallback((): TestResult => {
    return getTestResultFromState(gameState);
  }, [gameState]);

  return {
    // State
    mounted,
    gameState,
    personalBests,
    testConfig,

    // Actions
    handleCharacterInput,
    handleBackspace,
    startTest,
    endTest,
    resetTest,
    updateConfig,
    getTestResult,
  };
}

// Helper function to create TestResult from GameState
function getTestResultFromState(state: GameState): TestResult {
  const { config, stats, wpmHistory } = state;
  const consistency = calculateConsistency(wpmHistory);

  return {
    wpm: stats.wpm,
    rawWpm: stats.rawWpm,
    accuracy: stats.accuracy,
    consistency,
    correctChars: stats.correctChars,
    incorrectChars: stats.incorrectChars,
    mode: config.mode,
    timeLimit: config.mode === "time" ? config.timeLimit : undefined,
    wordCount: config.mode === "words" ? config.wordCount : undefined,
    timestamp: Date.now(),
  };
}

// Helper function to check if new result is better
function isBetterResult(
  newResult: TestResult,
  existingResult: TestResult | undefined
): boolean {
  if (!existingResult) return true;

  // Primary: higher WPM is better
  if (newResult.wpm > existingResult.wpm) return true;
  if (newResult.wpm < existingResult.wpm) return false;

  // Tiebreaker: higher accuracy
  if (newResult.accuracy > existingResult.accuracy) return true;
  if (newResult.accuracy < existingResult.accuracy) return false;

  // Tiebreaker: higher consistency
  return newResult.consistency > existingResult.consistency;
}

// Helper function to update personal bests
function updatePersonalBests(
  bests: PersonalBests,
  result: TestResult
): PersonalBests {
  const newBests = { ...bests };

  if (result.mode === "time" && result.timeLimit) {
    const existing = newBests.time[result.timeLimit];
    if (isBetterResult(result, existing)) {
      newBests.time = { ...newBests.time, [result.timeLimit]: result };
    }
  } else if (result.mode === "words" && result.wordCount) {
    const existing = newBests.words[result.wordCount];
    if (isBetterResult(result, existing)) {
      newBests.words = { ...newBests.words, [result.wordCount]: result };
    }
  }

  return newBests;
}
