'use client';

import './styles.css';
import { useGameLogic } from './hooks/useGameLogic';
import GameHeader from './components/GameHeader';
import MinesweeperBoard from './components/MinesweeperBoard';
import DifficultyDialog from './components/DifficultyDialog';
import WinDialog from './components/WinDialog';
import GameOverDialog from './components/GameOverDialog';
import InputModeToggle from './components/InputModeToggle';

export default function MinesweeperPage() {
  const {
    board,
    difficulty,
    customSettings,
    remainingMines,
    time,
    gameOver,
    won,
    bestTimes,
    incorrectFlags,
    inputMode,
    hasMouse,
    handleCellClick,
    handleCellRightClick,
    handleNewGame,
    toggleMode,
    showDifficultyDialog,
    setShowDifficultyDialog,
    showWinDialog,
    setShowWinDialog,
    showGameOverDialog,
    setShowGameOverDialog,
  } = useGameLogic();

  return (
    <div className="min-h-screen bg-[#008080] text-foreground flex items-start justify-center pt-4 sm:pt-8 lg:pt-12">
      <div className="flex flex-col items-center">
        {/* Classic Windows-style game container */}
        <div className="ms-container">
          <GameHeader
            remainingMines={remainingMines}
            time={time}
            gameOver={gameOver}
            won={won}
            onReset={() => handleNewGame()}
            onOpenDifficulty={() => setShowDifficultyDialog(true)}
          />

          <MinesweeperBoard
            board={board}
            incorrectFlags={incorrectFlags}
            onCellClick={handleCellClick}
            onCellRightClick={handleCellRightClick}
          />
        </div>

        <InputModeToggle
          mode={inputMode}
          onToggle={toggleMode}
          hasMouse={hasMouse}
        />

        <DifficultyDialog
          open={showDifficultyDialog}
          currentDifficulty={difficulty}
          currentCustomSettings={customSettings}
          onClose={() => setShowDifficultyDialog(false)}
          onStartGame={(newDifficulty, newCustomSettings) => {
            handleNewGame(newDifficulty, newCustomSettings);
            setShowDifficultyDialog(false);
          }}
        />

        <WinDialog
          open={showWinDialog}
          time={time}
          difficulty={difficulty}
          bestTimes={bestTimes}
          onNewGame={() => {
            handleNewGame();
            setShowWinDialog(false);
          }}
        />

        <GameOverDialog
          open={showGameOverDialog}
          onNewGame={() => {
            handleNewGame();
            setShowGameOverDialog(false);
          }}
        />
      </div>
    </div>
  );
}
