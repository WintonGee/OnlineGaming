import { useCallback, useEffect, useRef } from 'react';
import { useDialogState } from '@/hooks/useDialogState';
import { useGameState } from './useGameState';
import { useInputMode } from './useInputMode';
import { Difficulty, CustomSettings } from '../types';

export function useGameLogic() {
  const difficultyDialog = useDialogState();
  const winDialog = useDialogState();
  const hasShownWinDialog = useRef(false);

  const gameState = useGameState();
  const inputMode = useInputMode();

  const { gameOver, won, handleCellReveal, handleCellFlag, handleRevealHint, handleFlagHint, startNewGame } = gameState;
  const { hasMouse, inputMode: currentInputMode } = inputMode;

  // Handle cell click based on input mode
  const handleCellClick = useCallback((row: number, col: number) => {
    if (hasMouse) {
      // On desktop, left click always reveals
      handleCellReveal(row, col);
    } else {
      // On mobile, use input mode
      if (currentInputMode === 'reveal') {
        handleCellReveal(row, col);
      } else {
        handleCellFlag(row, col);
      }
    }
  }, [hasMouse, currentInputMode, handleCellReveal, handleCellFlag]);

  // Handle right click (flagging on desktop)
  const handleCellRightClick = useCallback((row: number, col: number) => {
    handleCellFlag(row, col);
  }, [handleCellFlag]);

  // Handle long press (flagging on mobile)
  const handleCellLongPress = useCallback((row: number, col: number) => {
    handleCellFlag(row, col);
  }, [handleCellFlag]);

  // Handle new game
  const handleNewGame = useCallback((newDifficulty?: Difficulty, newCustomSettings?: CustomSettings) => {
    startNewGame(newDifficulty, newCustomSettings);
    winDialog.close();
    hasShownWinDialog.current = false;
  }, [startNewGame, winDialog]);

  // Show win dialog when game is won (only once per game)
  useEffect(() => {
    if (gameOver && won && !hasShownWinDialog.current) {
      winDialog.open();
      hasShownWinDialog.current = true;
    }
  }, [gameOver, won, winDialog]);

  return {
    ...gameState,
    ...inputMode,
    handleCellClick,
    handleCellRightClick,
    handleCellLongPress,
    handleRevealHint,
    handleFlagHint,
    handleNewGame,
    showDifficultyDialog: difficultyDialog.isOpen,
    setShowDifficultyDialog: difficultyDialog.setIsOpen,
    showWinDialog: winDialog.isOpen,
    setShowWinDialog: winDialog.setIsOpen,
  };
}
