"use client";

import { useGameLogic } from "./hooks/useGameLogic";
import GameHeader from "@/components/games/GameHeader";
import GameHelpMenu from "@/components/games/GameHelpMenu";
import InstructionsDialog from "@/components/games/InstructionsDialog";
import { Button } from "@/components/ui/button";
import GameBoard from "./components/GameBoard";
import InstructionsContent from "./components/InstructionsContent";
import "./styles.css";

export default function BlackjackPage() {
  const {
    gameState,
    isAIThinking,
    statusMessage,
    handleHit,
    handleStand,
    handleNewGame,
    instructionsDialog,
  } = useGameLogic();

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6 mx-auto max-w-md w-full px-4 sm:px-0">
          <GameHeader title="Blackjack" />

          <div className="flex justify-center mt-3 sm:mt-7 lg:mt-9">
            <GameHelpMenu
              onHowToPlay={instructionsDialog.open}
              onNewGame={handleNewGame}
            />
          </div>
        </div>

        <GameBoard
          playerHand={gameState.playerHand}
          dealerHand={gameState.dealerHand}
          gamePhase={gameState.gamePhase}
          gameResult={gameState.gameResult}
          isAIThinking={isAIThinking}
          onHit={handleHit}
          onStand={handleStand}
          statusMessage={statusMessage}
        />

        {gameState.gamePhase === "gameOver" && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={handleNewGame}
              className="rounded-full px-6 py-2 text-sm font-semibold uppercase tracking-wide"
            >
              Play Again
            </Button>
          </div>
        )}

        <InstructionsDialog
          open={instructionsDialog.isOpen}
          onOpenChange={instructionsDialog.setIsOpen}
          title="How to Play Blackjack"
          description="sr-only"
          maxWidth="lg"
        >
          <InstructionsContent />
        </InstructionsDialog>
      </div>
    </div>
  );
}
