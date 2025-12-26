"use client";

import GameHeader from "@/components/games/GameHeader";
import GameHelpMenu from "@/components/games/GameHelpMenu";
import InstructionsDialog from "@/components/games/InstructionsDialog";
import { useGameLogic } from "./hooks/useGameLogic";
import { CHOICES } from "./constants";
import ChoiceButton from "./components/ChoiceButton";
import BattleArena from "./components/BattleArena";
import HistoryStrip from "./components/HistoryStrip";
import StatsDisplay from "./components/StatsDisplay";
import Confetti from "./components/Confetti";
import InstructionsContent from "./components/InstructionsContent";

export default function RockPaperScissorsPage() {
  const {
    phase,
    playerChoice,
    aiChoice,
    currentResult,
    showConfetti,
    stats,
    totalGames,
    winPercentage,
    history,
    handleChoice,
    handleNewGame,
    dismissConfetti,
    instructionsDialog,
  } = useGameLogic();

  const isDisabled = phase !== "idle";

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <GameHeader title="Rock Paper Scissors" />

        {/* Controls Row */}
        <div className="flex items-center justify-end mb-4">
          <GameHelpMenu
            onHowToPlay={instructionsDialog.open}
            onNewGame={handleNewGame}
          />
        </div>

        {/* Stats Display */}
        <div className="mb-4">
          <StatsDisplay
            stats={stats}
            totalGames={totalGames}
            winPercentage={winPercentage}
          />
        </div>

        {/* Battle Arena */}
        <div className="mb-6">
          <BattleArena
            phase={phase}
            playerChoice={playerChoice}
            aiChoice={aiChoice}
            result={currentResult}
          />
        </div>

        {/* Choice Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          {CHOICES.map((choice) => (
            <ChoiceButton
              key={choice}
              choice={choice}
              onClick={() => handleChoice(choice)}
              disabled={isDisabled}
              selected={playerChoice === choice && isDisabled}
            />
          ))}
        </div>

        {/* History Strip */}
        <div className="mb-4">
          <HistoryStrip history={history} />
        </div>

        {/* Confetti */}
        <Confetti show={showConfetti} onComplete={dismissConfetti} />

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
