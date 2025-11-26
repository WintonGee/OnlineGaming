import { useCallback, useState } from 'react';
import { useGameState } from './useGameState';
import { useInputMode } from './useInputMode';
import { Difficulty, CustomSettings } from '../types';

export function useGameLogic() {
  const [showDifficultyDialog, setShowDifficultyDialog] = useState(false);
  const [showWinDialog, setShowWinDialog] = useState(false);

  const gameState = useGameState();
  const inputMode = useInputMode();

  // Handle cell click based on input mode
  const handleCellClick = useCallback((row: number, col: number) => {
    if (inputMode.hasMouse) {
      // On desktop, left click always reveals
      gameState.handleCellReveal(row, col);
    } else {
      // On mobile, use input mode
      if (inputMode.inputMode === 'reveal') {
        gameState.handleCellReveal(row, col);
      } else {
        gameState.handleCellFlag(row, col);
      }
    }
  }, [gameState, inputMode]);

  // Handle right click (flagging on desktop)
  const handleCellRightClick = useCallback((row: number, col: number) => {
    gameState.handleCellFlag(row, col);
  }, [gameState]);

  // Handle new game
  const handleNewGame = useCallback((newDifficulty?: Difficulty, newCustomSettings?: CustomSettings) => {
    gameState.startNewGame(newDifficulty, newCustomSettings);
    setShowWinDialog(false);
  }, [gameState]);

  // Show win dialog when game is won
  const { gameOver, won } = gameState;
  if (gameOver && won && !showWinDialog) {
    setShowWinDialog(true);
  }

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
