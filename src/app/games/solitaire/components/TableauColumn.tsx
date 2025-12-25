"use client";

import { Card as CardType, CardLocation } from "../types";
import Card, { CardPlaceholder } from "./Card";
import { cn } from "@/lib/utils/cn";
import { CARD_OVERLAP, CARD_OVERLAP_FACEDOWN } from "../constants";

interface TableauColumnProps {
  cards: CardType[];
  columnIndex: number;
  selectedCardId?: string;
  onCardClick: (card: CardType, location: CardLocation) => void;
  onCardDoubleClick: (card: CardType, location: CardLocation) => void;
  onEmptyClick: (location: CardLocation) => void;
}

export default function TableauColumn({
  cards,
  columnIndex,
  selectedCardId,
  onCardClick,
  onCardDoubleClick,
  onEmptyClick,
}: TableauColumnProps) {
  const location: CardLocation = { pile: "tableau", index: columnIndex };

  if (cards.length === 0) {
    return (
      <CardPlaceholder
        onClick={() => onEmptyClick(location)}
        className="text-gray-400 dark:text-gray-500 text-2xl"
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

  return (
    <div
      className="relative"
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
              onClick={() => onCardClick(card, cardLocation)}
              onDoubleClick={() => card.faceUp && onCardDoubleClick(card, cardLocation)}
            />
          </div>
        );
      })}
    </div>
  );
}
