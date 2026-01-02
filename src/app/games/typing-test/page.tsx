"use client";

import GameHeader from "@/components/games/GameHeader";
import GameHelpMenu from "@/components/games/GameHelpMenu";
import InstructionsDialog from "@/components/games/InstructionsDialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGameLogic } from "./hooks/useGameLogic";
import WordDisplay from "./components/WordDisplay";
import StatsDisplay from "./components/StatsDisplay";
import ModeSelector from "./components/ModeSelector";
import ResultsDisplay from "./components/ResultsDisplay";
import InstructionsContent from "./components/InstructionsContent";
import { TimeOption, WordCountOption } from "./types";

export default function TypingTestPage() {
  const {
    gameState,
    testConfig,
    mounted,
    isNewPersonalBest,
    currentPersonalBest,
    testResult,
    handleNewTest,
    handleConfigChange,
    instructionsDialog,
    resultsDialog,
    inputRef,
  } = useGameLogic();

  // Show loading state until mounted (prevents hydration mismatch)
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <GameHeader title="Typing Test" />
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400 dark:text-gray-600">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hidden input for mobile keyboard support */}
        <input
          ref={inputRef}
          type="text"
          className="sr-only"
          aria-hidden="true"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />

        {/* Header */}
        <GameHeader title="Typing Test" />

        {/* Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <ModeSelector
            mode={testConfig.mode}
            timeLimit={testConfig.timeLimit}
            wordCount={testConfig.wordCount}
            onModeChange={(mode) => handleConfigChange({ mode })}
            onTimeLimitChange={(timeLimit) =>
              handleConfigChange({ timeLimit: timeLimit as TimeOption })
            }
            onWordCountChange={(wordCount) =>
              handleConfigChange({ wordCount: wordCount as WordCountOption })
            }
            disabled={gameState.isActive}
          />

          <GameHelpMenu
            onHowToPlay={instructionsDialog.open}
            onNewGame={handleNewTest}
          />
        </div>

        {/* Stats Display */}
        <StatsDisplay
          wpm={gameState.stats.wpm}
          accuracy={gameState.stats.accuracy}
          elapsedTime={gameState.elapsedTime}
          isActive={gameState.isActive}
          mode={testConfig.mode}
          timeLimit={testConfig.timeLimit}
          wordCount={testConfig.wordCount}
          currentWordIndex={gameState.currentWordIndex}
        />

        {/* Word Display */}
        <div className="mt-6">
          <WordDisplay
            words={gameState.words}
            currentWordIndex={gameState.currentWordIndex}
            currentCharIndex={gameState.currentCharIndex}
            isActive={gameState.isActive || !gameState.isComplete}
          />
        </div>

        {/* Keyboard hint */}
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-500">
          {gameState.isComplete ? (
            <span>
              Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-xs font-mono">Tab</kbd> to restart
            </span>
          ) : !gameState.isActive ? (
            <span>Start typing to begin the test</span>
          ) : (
            <span>
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-xs font-mono">Tab</kbd> to restart
            </span>
          )}
        </div>

        {/* Results Dialog */}
        <Dialog open={resultsDialog.isOpen} onOpenChange={resultsDialog.setIsOpen}>
          <DialogContent className="sm:max-w-lg">
            {testResult && (
              <ResultsDisplay
                stats={gameState.stats}
                personalBest={currentPersonalBest}
                isNewRecord={isNewPersonalBest}
              />
            )}
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleNewTest}
                className="flex-1"
              >
                New Test
              </Button>
              <Button
                variant="outline"
                onClick={() => resultsDialog.close()}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

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
