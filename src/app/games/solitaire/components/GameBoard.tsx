"use client";

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
  onDraw: () => void;
  onCardClick: (card: CardType, location: CardLocation) => void;
  onCardDoubleClick: (card: CardType, location: CardLocation) => void;
  onEmptyClick: (location: CardLocation) => void;
}

export default function GameBoard({
  tableau,
  foundation,
  stock,
  waste,
  drawCount,
  selectedCardId,
  onDraw,
  onCardClick,
  onCardDoubleClick,
  onEmptyClick,
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
          onDraw={onDraw}
          onWasteCardClick={onCardClick}
          onWasteCardDoubleClick={onCardDoubleClick}
        />

        {/* Foundation piles */}
        <div className="flex gap-2">
          {foundation.map((pile, index) => (
            <FoundationPile
              key={index}
              cards={pile}
              pileIndex={index}
              selectedCardId={selectedCardId}
              onCardClick={onCardClick}
              onEmptyClick={onEmptyClick}
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
            onCardClick={onCardClick}
            onCardDoubleClick={onCardDoubleClick}
            onEmptyClick={onEmptyClick}
          />
        ))}
      </div>
    </div>
  );
}
