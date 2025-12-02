"use client";

import "./styles.css";
import { useGameLogic } from "./hooks/useGameLogic";
import { useDialogState } from "@/hooks/useDialogState";
import GameHeader from "@/components/games/GameHeader";
import MinesweeperGameHeader from "./components/GameHeader";
import MinesweeperBoard from "./components/MinesweeperBoard";
import MinesweeperToolbar from "./components/MinesweeperToolbar";
import DifficultyDialog from "./components/DifficultyDialog";
import WinDialog from "@/components/games/WinDialog";
import InstructionsDialog from "./components/InstructionsDialog";
import { formatTime } from "./utils/formatTime";

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
    handleCellClick,
    handleCellRightClick,
    handleCellLongPress,
    handleRevealHint,
    handleFlagHint,
    handleNewGame,
    showDifficultyDialog,
    setShowDifficultyDialog,
    showWinDialog,
    setShowWinDialog,
  } = useGameLogic();

  const instructionsDialog = useDialogState();

  return (
    <div className="min-h-screen bg-white dark:bg-black text-foreground py-3 sm:py-8 lg:py-12 px-4">
      <div className="mx-auto w-full max-w-6xl px-0 sm:px-4 lg:px-12">
        {/* Header */}
        <div className="mb-3 sm:mb-8 lg:mb-12 flex flex-col gap-2 sm:gap-4 lg:gap-6">
          {/* Title */}
          <GameHeader title="Minesweeper" />

          {/* Difficulty Toolbar */}
          <div className="flex flex-col gap-2 sm:gap-4">
            <div className="flex flex-col lg:flex-row w-full items-center gap-2 lg:gap-4 justify-center">
              <MinesweeperToolbar
                selectedDifficulty={difficulty}
                onDifficultyChange={(newDifficulty) => {
                  if (newDifficulty !== "Custom") {
                    handleNewGame(newDifficulty);
                  } else {
                    setShowDifficultyDialog(true);
                  }
                }}
                onNewGame={() => handleNewGame()}
                onCustomClick={() => setShowDifficultyDialog(true)}
                onHowToPlay={instructionsDialog.open}
                onRevealHint={handleRevealHint}
                onFlagHint={handleFlagHint}
              />
            </div>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="flex flex-col items-center justify-center">
          {/* Classic Windows-style game container */}
          <div className="ms-container">
            <MinesweeperGameHeader
              remainingMines={remainingMines}
              time={time}
              gameOver={gameOver}
              won={won}
              onReset={() => handleNewGame()}
            />

            <MinesweeperBoard
              board={board}
              incorrectFlags={incorrectFlags}
              onCellClick={handleCellClick}
              onCellRightClick={handleCellRightClick}
              onCellLongPress={handleCellLongPress}
            />
          </div>
        </div>

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
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setShowWinDialog(false);
            }
          }}
          time={time}
          difficulty={difficulty}
          bestTimes={bestTimes}
          onNewGame={() => {
            handleNewGame();
            setShowWinDialog(false);
          }}
          formatTime={formatTime}
        />

        <InstructionsDialog
          open={instructionsDialog.isOpen}
          onOpenChange={instructionsDialog.setIsOpen}
        />
      </div>
    </div>
  );
}
