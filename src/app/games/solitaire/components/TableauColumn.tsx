"use client";

import { DragEvent } from "react";
import { Card as CardType, CardLocation } from "../types";
import Card, { CardPlaceholder } from "./Card";
import { CARD_OVERLAP, CARD_OVERLAP_FACEDOWN } from "../constants";

interface TableauColumnProps {
  cards: CardType[];
  columnIndex: number;
  selectedCardId?: string;
  draggedCardIds?: string[];
  dragOverLocation?: CardLocation | null;
  onCardClick: (card: CardType, location: CardLocation) => void;
  onCardDoubleClick: (card: CardType, location: CardLocation) => void;
  onEmptyClick: (location: CardLocation) => void;
  onDragStart: (cards: CardType[], source: CardLocation) => (e: DragEvent) => void;
  onDragEnd: () => void;
  onDragOver: (location: CardLocation) => (e: DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (location: CardLocation) => (e: DragEvent) => void;
}

export default function TableauColumn({
  cards,
  columnIndex,
  selectedCardId,
  draggedCardIds = [],
  dragOverLocation,
  onCardClick,
  onCardDoubleClick,
  onEmptyClick,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
}: TableauColumnProps) {
  const location: CardLocation = { pile: "tableau", index: columnIndex };

  const isThisColumnDragOver =
    dragOverLocation?.pile === "tableau" && dragOverLocation?.index === columnIndex;

  if (cards.length === 0) {
    return (
      <CardPlaceholder
        onClick={() => onEmptyClick(location)}
        className="text-gray-400 dark:text-gray-500 text-2xl"
        isDragOver={isThisColumnDragOver}
        onDragOver={onDragOver(location)}
        onDragLeave={onDragLeave}
        onDrop={onDrop(location)}
      >
        K
      </CardPlaceholder>
    );
  }

  // Calculate total height needed
  const totalHeight = cards.reduce((acc, card, idx) => {
    if (idx === 0) return 100; // First card full height
    return acc + (card.faceUp ? CARD_OVERLAP : CARD_OVERLAP_FACEDOWN);
  }, 0);

  // Check if this is the top card for drop target
  const topCardIndex = cards.length - 1;

  return (
    <div
      className="relative w-[70px] flex-shrink-0"
      style={{ height: `${totalHeight}px`, minHeight: "100px" }}
    >
      {cards.map((card, cardIndex) => {
        // Calculate top offset
        let top = 0;
        for (let i = 0; i < cardIndex; i++) {
          top += cards[i].faceUp ? CARD_OVERLAP : CARD_OVERLAP_FACEDOWN;
        }

        const cardLocation: CardLocation = {
          pile: "tableau",
          index: columnIndex,
          cardIndex,
        };

        const isSelected = selectedCardId === card.id;
        const isPlayable = card.faceUp;
        const isDragging = draggedCardIds.includes(card.id);
        const isTopCard = cardIndex === topCardIndex;
        const isDragOver = isThisColumnDragOver && isTopCard;

        // Get cards from this position to end (for dragging stacks)
        const cardsFromHere = cards.slice(cardIndex);

        return (
          <div
            key={card.id}
            className="absolute left-0"
            style={{
              top: `${top}px`,
              zIndex: cardIndex,
            }}
          >
            <Card
              card={card}
              isSelected={isSelected}
              isPlayable={isPlayable}
              isDragging={isDragging}
              isDragOver={isDragOver}
              draggable={isPlayable}
              onClick={() => onCardClick(card, cardLocation)}
              onDoubleClick={() => card.faceUp && onCardDoubleClick(card, cardLocation)}
              onDragStart={isPlayable ? onDragStart(cardsFromHere, cardLocation) : undefined}
              onDragEnd={onDragEnd}
              onDragOver={isTopCard ? onDragOver(location) : undefined}
              onDragLeave={isTopCard ? onDragLeave : undefined}
              onDrop={isTopCard ? onDrop(location) : undefined}
            />
          </div>
        );
      })}
    </div>
  );
}
