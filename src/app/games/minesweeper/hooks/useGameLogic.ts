import { useCallback, useState, useEffect } from 'react';
import { useGameState } from './useGameState';
import { useInputMode } from './useInputMode';
import { Difficulty, CustomSettings } from '../types';

export function useGameLogic() {
  const [showDifficultyDialog, setShowDifficultyDialog] = useState(false);
  const [showWinDialog, setShowWinDialog] = useState(false);

  const gameState = useGameState();
  const inputMode = useInputMode();

  const { gameOver, won, handleCellReveal, handleCellFlag, startNewGame } = gameState;
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

  // Handle new game
  const handleNewGame = useCallback((newDifficulty?: Difficulty, newCustomSettings?: CustomSettings) => {
    startNewGame(newDifficulty, newCustomSettings);
    setShowWinDialog(false);
  }, [startNewGame]);

  // Show win dialog when game is won (proper effect, not during render)
  useEffect(() => {
    if (gameOver && won) {
      setShowWinDialog(true);
    }
  }, [gameOver, won]);

  return {
    ...gameState,
    ...inputMode,
    handleCellClick,
    handleCellRightClick,
    handleNewGame,
    showDifficultyDialog,
    setShowDifficultyDialog,
    showWinDialog,
    setShowWinDialog,
  };
}
