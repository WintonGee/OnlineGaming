"use client";

import { useGameLogic } from "./hooks/useGameLogic";
import TileGameBoard from "./components/TileGameBoard";
import GameHeader from "@/components/games/GameHeader";
import GameHelpMenu from "@/components/games/GameHelpMenu";
import WinDialog from "@/components/games/WinDialog";
import GameOverDialog from "@/components/games/GameOverDialog";
import InstructionsDialog from "./components/InstructionsDialog";
import "./styles.css";

export default function Game2048Page() {
  const {
    tiles,
    score,
    bestScore,
    startNewGame,
    handleMove,
    continueAfterWin,
    showInstructions,
    openInstructions,
    closeInstructions,
    showWinDialog,
    setShowWinDialog,
    showGameOverDialog,
    setShowGameOverDialog,
  } = useGameLogic();

  return (
    <div className="bg-white dark:bg-black pt-8 pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 mx-auto max-w-md w-full px-4 sm:px-0">
          {/* Title */}
          <GameHeader title="2048" />

          {/* Buttons and scores row */}
          <div className="flex items-center justify-between gap-3 mb-4 mt-3 sm:mt-7 lg:mt-9">
            <div className="flex gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="bg-gray-200 dark:bg-gray-800 rounded-lg px-3 sm:px-4 py-2 min-w-[80px] sm:min-w-[100px] flex-shrink-0">
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Score
                </div>
                <div className="text-xl sm:text-2xl font-bold text-black dark:text-white">
                  {score}
                </div>
              </div>

              <div className="bg-gray-200 dark:bg-gray-800 rounded-lg px-3 sm:px-4 py-2 min-w-[80px] sm:min-w-[100px] flex-shrink-0">
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Best
                </div>
                <div className="text-xl sm:text-2xl font-bold text-black dark:text-white">
                  {bestScore}
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <GameHelpMenu
                onHowToPlay={openInstructions}
                onNewGame={startNewGame}
              />
            </div>
          </div>
        </div>

        <TileGameBoard tiles={tiles} onMove={handleMove} />

        {/* Win Dialog */}
        <WinDialog
          open={showWinDialog}
          onOpenChange={setShowWinDialog}
          onContinue={continueAfterWin}
          onNewGame={startNewGame}
          message="Congratulations! You reached the 2048 tile!"
        />

        {/* Game Over Dialog */}
        <GameOverDialog
          open={showGameOverDialog}
          onOpenChange={setShowGameOverDialog}
          message="No more moves available."
          score={score}
          onNewGame={startNewGame}
          buttonText="Try Again"
        />

        {/* Instructions Dialog */}
        <InstructionsDialog
          open={showInstructions}
          onOpenChange={closeInstructions}
        />
      </div>
    </div>
  );
}
