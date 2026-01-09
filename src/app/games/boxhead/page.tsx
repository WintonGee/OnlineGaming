"use client";

import GameHeader from "@/components/games/GameHeader";
import GameHelpMenu from "@/components/games/GameHelpMenu";
import GameOverDialog from "@/components/games/GameOverDialog";
import InstructionsDialog from "@/components/games/InstructionsDialog";
import { useGameLogic } from "./hooks/useGameLogic";
import GameCanvas from "./components/GameCanvas";
import GameUI from "./components/GameUI";
import ModeSelector from "./components/ModeSelector";
import InstructionsContent from "./components/InstructionsContent";

export default function BoxheadPage() {
  const {
    gameState,
    highScores,
    explosions,
    startGame,
    newGame,
    togglePause,
    returnToMenu,
    instructionsDialog,
    gameOverDialog,
  } = useGameLogic();

  const isPlaying =
    gameState.phase === "playing" || gameState.phase === "paused";

  // Get game over message
  const getGameOverMessage = () => {
    if (gameState.mode === "deathmatch" && gameState.deathmatchWinner) {
      return `Player ${gameState.deathmatchWinner} Wins!`;
    }
    return `Wave ${gameState.wave.currentWave} - ${gameState.totalKills} Kills`;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-4">
          <GameHeader title="Boxhead" />
        </div>

        {/* Menu / Game */}
        {gameState.phase === "menu" ? (
          <ModeSelector
            onSelectMode={startGame}
            highScores={highScores}
            onShowInstructions={instructionsDialog.open}
          />
        ) : (
          <>
            {/* Controls Row */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="text-sm text-gray-400">
                {gameState.mode === "single"
                  ? "Single Player"
                  : gameState.mode === "coop"
                  ? "Cooperative"
                  : "Deathmatch"}
              </div>
              <GameHelpMenu
                onHowToPlay={instructionsDialog.open}
                onNewGame={returnToMenu}
              />
            </div>

            {/* Game UI */}
            <GameUI gameState={gameState} highScores={highScores} />

            {/* Game Canvas */}
            <GameCanvas gameState={gameState} explosions={explosions} />

            {/* Controls hint */}
            <div className="mt-4 text-center text-xs text-gray-500">
              Press <kbd className="bg-gray-700 px-1 rounded">P</kbd> to
              pause
            </div>
          </>
        )}

        {/* Dialogs */}
        {gameState.mode === "deathmatch" ? (
          <GameOverDialog
            open={gameOverDialog.isOpen}
            onOpenChange={gameOverDialog.setIsOpen}
            icon="skull"
            title="Match Over!"
            message={getGameOverMessage()}
            onNewGame={newGame}
            buttonText="Play Again"
          />
        ) : (
          <GameOverDialog
            open={gameOverDialog.isOpen}
            onOpenChange={gameOverDialog.setIsOpen}
            icon="skull"
            title="Game Over"
            message={getGameOverMessage()}
            score={gameState.totalScore}
            highScore={
              gameState.mode === "single" ? highScores.single : highScores.coop
            }
            onNewGame={newGame}
            buttonText="Play Again"
          />
        )}

        <InstructionsDialog
          open={instructionsDialog.isOpen}
          onOpenChange={instructionsDialog.setIsOpen}
          title="How to Play Boxhead"
          maxWidth="lg"
        >
          <InstructionsContent />
        </InstructionsDialog>
      </div>
    </div>
  );
}
