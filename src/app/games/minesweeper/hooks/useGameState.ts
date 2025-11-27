import { useState, useCallback } from 'react';
import { Board, Difficulty, CustomSettings, BestTimes } from '../types';
import { generateBoard } from '../logic/boardGeneration';
import { revealCell, toggleFlag, countFlaggedCells, revealAllMines, flagAllMines } from '../logic/cellReveal';
import { checkWinCondition, checkLoseCondition, getIncorrectFlags } from '../logic/gameValidation';
import { DIFFICULTY_CONFIG, DEFAULT_DIFFICULTY, BEST_TIMES_KEY } from '../constants';
import { useTimer } from '@/lib/games/hooks/useTimer';
import { useIsMobile, getExpertDimensions } from './useResponsiveDimensions';
import { revealRandomNumber, flagRandomMine } from '../logic/hints';
import { createStorage } from '@/lib/shared/utils/storage';

interface UseGameStateProps {
  initialDifficulty?: Difficulty;
  customSettings?: CustomSettings;
}

// Create type-safe storage for best times
const bestTimesStorage = createStorage<BestTimes>(BEST_TIMES_KEY);

export function useGameState({ initialDifficulty = DEFAULT_DIFFICULTY, customSettings }: UseGameStateProps = {}) {
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [currentCustomSettings, setCurrentCustomSettings] = useState<CustomSettings | undefined>(customSettings);
  const isMobile = useIsMobile();
  const [board, setBoard] = useState<Board>(() => {
    // Use initial mobile state for first render
    const initialIsMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
    return initializeBoard(initialDifficulty, customSettings, initialIsMobile);
  });
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [firstClick, setFirstClick] = useState(true);
  const [bestTimes, setBestTimes] = useState<BestTimes>(() => loadBestTimes());

  const timer = useTimer();

  const totalMines = getCurrentMineCount(difficulty, currentCustomSettings);
  const flagsUsed = countFlaggedCells(board);
  const remainingMines = totalMines - flagsUsed;

  // Initialize board based on difficulty
  function initializeBoard(diff: Difficulty, custom?: CustomSettings, mobile?: boolean): Board {
    if (diff === 'Custom' && custom) {
      return generateBoard(custom.width, custom.height, custom.mines);
    }
    if (diff === 'Expert') {
      const expertDims = getExpertDimensions(mobile ?? false);
      return generateBoard(expertDims.width, expertDims.height, DIFFICULTY_CONFIG.Expert.mines);
    }
    const config = DIFFICULTY_CONFIG[diff as keyof typeof DIFFICULTY_CONFIG] || DIFFICULTY_CONFIG.Beginner;
    return generateBoard(config.width, config.height, config.mines);
  }

  // Get current mine count
  function getCurrentMineCount(diff: Difficulty, custom?: CustomSettings): number {
    if (diff === 'Custom' && custom) {
      return custom.mines;
    }
    const config = DIFFICULTY_CONFIG[diff as keyof typeof DIFFICULTY_CONFIG] || DIFFICULTY_CONFIG.Beginner;
    return config.mines;
  }

  // Load best times from localStorage
  function loadBestTimes(): BestTimes {
    return bestTimesStorage.load() ?? {};
  }

  // Save best times to localStorage
  function saveBestTimes(times: BestTimes) {
    bestTimesStorage.save(times);
  }

  // Handle cell click (reveal)
  const handleCellReveal = useCallback((row: number, col: number) => {
    if (gameOver || board[row][col].isRevealed || board[row][col].isFlagged) {
      return;
    }

    // Start timer on first click
    if (firstClick) {
      timer.start();
      setFirstClick(false);
    }

    const newBoard = revealCell(board, row, col);
    setBoard(newBoard);

    // Check for loss
    if (checkLoseCondition(newBoard)) {
      const boardWithMines = revealAllMines(newBoard);
      setBoard(boardWithMines);
      setGameOver(true);
      setWon(false);
      timer.stop();
      return;
    }

    // Check for win
    if (checkWinCondition(newBoard, totalMines)) {
      const boardWithFlags = flagAllMines(newBoard);
      setBoard(boardWithFlags);
      setGameOver(true);
      setWon(true);
      timer.stop();

      // Update best time
      const currentTime = timer.time;
      const currentBest = bestTimes[difficulty];
      if (!currentBest || currentTime < currentBest) {
        const newBestTimes = { ...bestTimes, [difficulty]: currentTime };
        setBestTimes(newBestTimes);
        saveBestTimes(newBestTimes);
      }
    }
  }, [board, gameOver, firstClick, timer, totalMines, difficulty, bestTimes]);

  // Handle cell flag toggle
  const handleCellFlag = useCallback((row: number, col: number) => {
    if (gameOver || board[row][col].isRevealed) {
      return;
    }

    // Start timer on first click
    if (firstClick) {
      timer.start();
      setFirstClick(false);
    }

    const newBoard = toggleFlag(board, row, col);
    setBoard(newBoard);
  }, [board, gameOver, firstClick, timer]);

  // Start new game
  const startNewGame = useCallback((newDifficulty?: Difficulty, newCustomSettings?: CustomSettings) => {
    const diff = newDifficulty || difficulty;
    const custom = newCustomSettings || currentCustomSettings;

    setDifficulty(diff);
    setCurrentCustomSettings(custom);
    setBoard(initializeBoard(diff, custom, isMobile));
    setGameOver(false);
    setWon(false);
    setFirstClick(true);
    timer.reset();
  }, [difficulty, currentCustomSettings, isMobile, timer]);

  // Handle hint: reveal a random number
  const handleRevealHint = useCallback(() => {
    if (gameOver) return;

    // Start timer on first hint if game hasn't started
    if (firstClick) {
      timer.start();
      setFirstClick(false);
    }

    const newBoard = revealRandomNumber(board);
    if (!newBoard) {
      // No safe cells available to reveal
      return;
    }

    setBoard(newBoard);

    // Check for win after revealing
    if (checkWinCondition(newBoard, totalMines)) {
      const boardWithFlags = flagAllMines(newBoard);
      setBoard(boardWithFlags);
      setGameOver(true);
      setWon(true);
      timer.stop();

      // Update best time
      const currentTime = timer.time;
      const currentBest = bestTimes[difficulty];
      if (!currentBest || currentTime < currentBest) {
        const newBestTimes = { ...bestTimes, [difficulty]: currentTime };
        setBestTimes(newBestTimes);
        saveBestTimes(newBestTimes);
      }
    }
  }, [board, gameOver, firstClick, timer, totalMines, difficulty, bestTimes]);

  // Handle hint: flag a random mine
  const handleFlagHint = useCallback(() => {
    if (gameOver) return;

    // Start timer on first hint if game hasn't started
    if (firstClick) {
      timer.start();
      setFirstClick(false);
    }

    const newBoard = flagRandomMine(board);
    if (!newBoard) {
      // No unflagged mines available
      return;
    }

    setBoard(newBoard);
  }, [board, gameOver, firstClick, timer]);

  // Get incorrect flags for display when game is lost
  const incorrectFlags = gameOver && !won ? getIncorrectFlags(board) : [];

  return {
    board,
    difficulty,
    customSettings: currentCustomSettings,
    gameOver,
    won,
    totalMines,
    flagsUsed,
    remainingMines,
    time: timer.time,
    bestTimes,
    incorrectFlags,
    handleCellReveal,
    handleCellFlag,
    handleRevealHint,
    handleFlagHint,
    startNewGame,
  };
}
