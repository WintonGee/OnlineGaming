"use client";

import { useCallback } from "react";
import { useGameLogic } from "./hooks/useGameLogic";
import { useDragDrop } from "./hooks/useDragDrop";
import GameHeader from "@/components/games/GameHeader";
import GameHelpMenu from "@/components/games/GameHelpMenu";
import WinDialog from "@/components/games/WinDialog";
import InstructionsDialog from "@/components/games/InstructionsDialog";
import { Button } from "@/components/ui/button";
import GameBoard from "./components/GameBoard";
import InstructionsContent from "./components/InstructionsContent";
import { cn } from "@/lib/utils/cn";
import { CardLocation } from "./types";
import "./styles.css";

export default function SolitairePage() {
  const {
    tableau,
    foundation,
    stock,
    waste,
    moves,
    drawCount,
    selectedCard,
    isAutoCompleting,
    isInitialized,
    canAutoComplete,
    stats,
    handleDraw,
    handleCardClick,
    handleEmptyClick,
    handleAutoMove,
    handleMove,
    handleNewGame,
    handleChangeDrawCount,
    startAutoComplete,
    instructionsDialog,
    winDialog,
  } = useGameLogic();

  const {
    draggedCards,
    dragOverPile,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useDragDrop();

  const handleCardDoubleClick = (card: Parameters<typeof handleCardClick>[0], location: Parameters<typeof handleCardClick>[1]) => {
    handleAutoMove(card, location);
  };

  const onDrop = useCallback(
    (location: CardLocation) => handleDrop(location, handleMove),
    [handleDrop, handleMove]
  );

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <GameHeader title="Solitaire" />

          {/* Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 sm:mt-4">
            {/* Draw mode toggle */}
            <div className="inline-flex rounded-full border-2 border-gray-300 dark:border-gray-600 p-0.5 bg-gray-100 dark:bg-gray-800">
              {([1, 3] as const).map((count) => (
                <button
                  key={count}
                  onClick={() => handleChangeDrawCount(count)}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                    drawCount === count
                      ? "bg-white dark:bg-black text-black dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  )}
                >
                  Draw {count}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {canAutoComplete && !isAutoCompleting && (
                <Button
                  onClick={startAutoComplete}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  Auto Complete
                </Button>
              )}
              <GameHelpMenu
                onHowToPlay={instructionsDialog.open}
                onNewGame={() => handleNewGame()}
              />
            </div>
          </div>
        </div>

        {/* Stats Display */}
        <div className="flex gap-4 justify-center mb-4 sm:mb-6">
          <StatBox label="Moves" value={moves} />
          <StatBox label="Won" value={stats.gamesWon} />
          {stats.bestMoves !== null && (
            <StatBox label="Best" value={stats.bestMoves} />
          )}
        </div>

        {/* Game Board */}
        <div className={cn(
          "overflow-x-auto pb-4",
          isAutoCompleting && "pointer-events-none"
        )}>
          <div className="min-w-[540px] px-2">
            {!isInitialized ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="text-gray-500 dark:text-gray-400">Loading...</div>
              </div>
            ) : (
              <GameBoard
                tableau={tableau}
                foundation={foundation}
                stock={stock}
                waste={waste}
                drawCount={drawCount}
                selectedCardId={selectedCard?.card.id}
                draggedCardIds={draggedCards?.cards.map(c => c.id)}
                dragOverLocation={dragOverPile}
                onDraw={handleDraw}
                onCardClick={handleCardClick}
                onCardDoubleClick={handleCardDoubleClick}
                onEmptyClick={handleEmptyClick}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={onDrop}
              />
            )}
          </div>
        </div>

        {/* Dialogs */}
        <WinDialog
          open={winDialog.isOpen}
          onOpenChange={winDialog.setIsOpen}
          title="Congratulations!"
          moves={moves}
          bestMoves={stats.bestMoves}
          onNewGame={() => handleNewGame()}
        />

        <InstructionsDialog
          open={instructionsDialog.isOpen}
          onOpenChange={instructionsDialog.setIsOpen}
          title="How to Play Solitaire"
          maxWidth="lg"
        >
          <InstructionsContent />
        </InstructionsDialog>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-gray-200 dark:bg-gray-800 rounded-lg px-4 py-2 text-center min-w-[70px]">
      <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </div>
      <div className="text-xl sm:text-2xl font-bold text-black dark:text-white font-mono">
        {value}
      </div>
    </div>
  );
}
