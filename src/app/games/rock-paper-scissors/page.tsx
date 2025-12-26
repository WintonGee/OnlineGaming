"use client";

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
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-2xl">
        {/* Header with Help Menu inline */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-black dark:text-white">
            Rock Paper Scissors
          </h1>
          <GameHelpMenu
            onHowToPlay={instructionsDialog.open}
            onNewGame={handleNewGame}
          />
        </div>

        {/* Compact Stats Display */}
        <div className="mb-3 sm:mb-4">
          <StatsDisplay
            stats={stats}
            totalGames={totalGames}
            winPercentage={winPercentage}
          />
        </div>

        {/* Battle Arena */}
        <div className="mb-4 sm:mb-6">
          <BattleArena
            phase={phase}
            playerChoice={playerChoice}
            aiChoice={aiChoice}
            result={currentResult}
          />
        </div>

        {/* Choice Buttons */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-3 sm:mb-6">
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

        {/* History Strip - only show when there's history */}
        {history.length > 0 && (
          <div className="mb-2">
            <HistoryStrip history={history} />
          </div>
        )}

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
