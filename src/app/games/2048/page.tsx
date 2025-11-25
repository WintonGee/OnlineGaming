"use client";

import { useGameLogic } from "./hooks/useGameLogic";
import TileGameBoard from "./components/TileGameBoard";
import GameHeader from "./components/GameHeader";
import WinDialog from "./components/WinDialog";
import GameOverDialog from "./components/GameOverDialog";
import InstructionsDialog from "./components/InstructionsDialog";
import "./styles.css";

export default function Game2048Page() {
  const {
    tiles,
    score,
    bestScore,
    gameOver,
    won,
    keepPlaying,
    startNewGame,
    handleMove,
    continueAfterWin,
    showInstructions,
    openInstructions,
    closeInstructions,
  } = useGameLogic();

  return (
    <div className="bg-white dark:bg-black pt-8 pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        <GameHeader
          score={score}
          bestScore={bestScore}
          onNewGame={startNewGame}
          onShowInstructions={openInstructions}
        />

        <TileGameBoard tiles={tiles} onMove={handleMove} />

        {/* Win Dialog - only show if won and not continuing */}
        <WinDialog
          open={won && !keepPlaying}
          onContinue={continueAfterWin}
          onNewGame={startNewGame}
        />

        {/* Game Over Dialog */}
        <GameOverDialog
          open={gameOver}
          score={score}
          onNewGame={startNewGame}
        />

        {/* Instructions Dialog */}
        <InstructionsDialog
          open={showInstructions}
          onClose={closeInstructions}
        />
      </div>
    </div>
  );
}
