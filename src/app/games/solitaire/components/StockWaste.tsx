"use client";

import { DragEvent } from "react";
import { Card as CardType, CardLocation } from "../types";
import Card, { CardPlaceholder } from "./Card";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StockWasteProps {
  stock: CardType[];
  waste: CardType[];
  drawCount: 1 | 3;
  selectedCardId?: string;
  draggedCardId?: string;
  onDraw: () => void;
  onWasteCardClick: (card: CardType, location: CardLocation) => void;
  onWasteCardDoubleClick: (card: CardType, location: CardLocation) => void;
  onDragStart: (cards: CardType[], source: CardLocation) => (e: DragEvent) => void;
  onDragEnd: () => void;
}

export default function StockWaste({
  stock,
  waste,
  drawCount,
  selectedCardId,
  draggedCardId,
  onDraw,
  onWasteCardClick,
  onWasteCardDoubleClick,
  onDragStart,
  onDragEnd,
}: StockWasteProps) {
  const location: CardLocation = { pile: "waste", index: 0 };

  // Show up to 3 waste cards spread out (for draw 3 mode)
  const visibleWaste = drawCount === 3 ? waste.slice(-3) : waste.slice(-1);

  return (
    <div className="flex gap-4">
      {/* Stock pile */}
      <div className="relative">
        {stock.length > 0 ? (
          <div
            className="cursor-pointer"
            onClick={onDraw}
          >
            <Card card={stock[stock.length - 1]} isPlayable={false} />
            {/* Show card count badge */}
            <div className="absolute -bottom-2 -right-2 bg-gray-700 dark:bg-gray-600 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {stock.length}
            </div>
          </div>
        ) : (
          <CardPlaceholder onClick={onDraw} className="cursor-pointer">
            <RefreshCw className="w-6 h-6 text-gray-400 dark:text-gray-500" />
          </CardPlaceholder>
        )}
      </div>

      {/* Waste pile */}
      <div
        className="relative"
        style={{ width: drawCount === 3 && visibleWaste.length > 1 ? `${70 + (visibleWaste.length - 1) * 20}px` : "70px" }}
      >
        {visibleWaste.length === 0 ? (
          <CardPlaceholder />
        ) : (
          visibleWaste.map((card, idx) => {
            const isTopCard = idx === visibleWaste.length - 1;
            const isSelected = selectedCardId === card.id;
            const isDragging = draggedCardId === card.id;

            return (
              <div
                key={card.id}
                className="absolute top-0"
                style={{
                  left: drawCount === 3 ? `${idx * 20}px` : 0,
                  zIndex: idx,
                }}
              >
                <Card
                  card={card}
                  isSelected={isSelected}
                  isPlayable={isTopCard}
                  isDragging={isDragging}
                  draggable={isTopCard}
                  onClick={isTopCard ? () => onWasteCardClick(card, location) : undefined}
                  onDoubleClick={isTopCard ? () => onWasteCardDoubleClick(card, location) : undefined}
                  onDragStart={isTopCard ? onDragStart([card], location) : undefined}
                  onDragEnd={onDragEnd}
                  className={cn(!isTopCard && "pointer-events-none")}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
