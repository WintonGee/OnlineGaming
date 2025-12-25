"use client";

import { DragEvent } from "react";
import { Card as CardType, CardLocation } from "../types";
import TableauColumn from "./TableauColumn";
import FoundationPile from "./FoundationPile";
import StockWaste from "./StockWaste";

interface GameBoardProps {
  tableau: CardType[][];
  foundation: CardType[][];
  stock: CardType[];
  waste: CardType[];
  drawCount: 1 | 3;
  selectedCardId?: string;
  draggedCardIds?: string[];
  dragOverLocation?: CardLocation | null;
  onDraw: () => void;
  onCardClick: (card: CardType, location: CardLocation) => void;
  onCardDoubleClick: (card: CardType, location: CardLocation) => void;
  onEmptyClick: (location: CardLocation) => void;
  onDragStart: (cards: CardType[], source: CardLocation) => (e: DragEvent) => void;
  onDragEnd: () => void;
  onDragOver: (location: CardLocation) => (e: DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (location: CardLocation) => (e: DragEvent) => void;
}

export default function GameBoard({
  tableau,
  foundation,
  stock,
  waste,
  drawCount,
  selectedCardId,
  draggedCardIds = [],
  dragOverLocation,
  onDraw,
  onCardClick,
  onCardDoubleClick,
  onEmptyClick,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
}: GameBoardProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Top row: Stock/Waste on left, Foundation on right */}
      <div className="flex justify-between items-start">
        {/* Stock and Waste */}
        <StockWaste
          stock={stock}
          waste={waste}
          drawCount={drawCount}
          selectedCardId={selectedCardId}
          draggedCardId={draggedCardIds[0]}
          onDraw={onDraw}
          onWasteCardClick={onCardClick}
          onWasteCardDoubleClick={onCardDoubleClick}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />

        {/* Foundation piles */}
        <div className="flex gap-2">
          {foundation.map((pile, index) => (
            <FoundationPile
              key={index}
              cards={pile}
              pileIndex={index}
              selectedCardId={selectedCardId}
              dragOverLocation={dragOverLocation}
              onCardClick={onCardClick}
              onEmptyClick={onEmptyClick}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            />
          ))}
        </div>
      </div>

      {/* Tableau columns */}
      <div className="flex gap-2 justify-center">
        {tableau.map((column, index) => (
          <TableauColumn
            key={index}
            cards={column}
            columnIndex={index}
            selectedCardId={selectedCardId}
            draggedCardIds={draggedCardIds}
            dragOverLocation={dragOverLocation}
            onCardClick={onCardClick}
            onCardDoubleClick={onCardDoubleClick}
            onEmptyClick={onEmptyClick}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          />
        ))}
      </div>
    </div>
  );
}
