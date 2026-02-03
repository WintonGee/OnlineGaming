"use client";

import GameHeader from "@/components/games/GameHeader";
import GameHelpMenu from "@/components/games/GameHelpMenu";
import InstructionsDialog from "@/components/games/InstructionsDialog";
import { useGameLogic } from "./hooks/useGameLogic";
import ReactionArea from "./components/ReactionArea";
import StatsDisplay from "./components/StatsDisplay";
import InstructionsContent from "./components/InstructionsContent";

export default function ReactionTimerPage() {
  const {
    phase,
    currentTime,
    bestTime,
    performanceFeedback,
    stats,
    handleAreaClick,
    handleNewGame,
    instructionsDialog,
  } = useGameLogic();

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <GameHeader title="Reaction Timer" />

        {/* Controls Row */}
        <div className="flex items-center justify-end mb-4">
          <GameHelpMenu
            onHowToPlay={instructionsDialog.open}
            onNewGame={handleNewGame}
          />
        </div>

        {/* Stats Display */}
        <div className="mb-6">
          <StatsDisplay stats={stats} bestTime={bestTime} />
        </div>

        {/* Reaction Area */}
        <ReactionArea
          phase={phase}
          currentTime={currentTime}
          performanceFeedback={performanceFeedback}
          onClick={handleAreaClick}
        />

        {/* Instructions Dialog */}
        <InstructionsDialog
          open={instructionsDialog.isOpen}
          onOpenChange={instructionsDialog.setIsOpen}
          title="How to Play"
        >
          <InstructionsContent />
        </InstructionsDialog>
      </div>
    </div>
  );
}
