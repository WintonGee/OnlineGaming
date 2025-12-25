"use client";

import { DragEvent } from "react";
import { Card as CardType, CardLocation, Suit } from "../types";
import Card, { CardPlaceholder } from "./Card";

interface FoundationPileProps {
  cards: CardType[];
  pileIndex: number;
  selectedCardId?: string;
  dragOverLocation?: CardLocation | null;
  onCardClick: (card: CardType, location: CardLocation) => void;
  onEmptyClick: (location: CardLocation) => void;
  onDragOver: (location: CardLocation) => (e: DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (location: CardLocation) => (e: DragEvent) => void;
}

const SUIT_SYMBOLS: Record<Suit, string> = {
  spades: "♠",
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
};

const SUIT_COLORS: Record<Suit, string> = {
  spades: "text-gray-400 dark:text-gray-500",
  hearts: "text-red-300 dark:text-red-400/50",
  diamonds: "text-red-300 dark:text-red-400/50",
  clubs: "text-gray-400 dark:text-gray-500",
};

const FOUNDATION_SUITS: Suit[] = ["spades", "hearts", "diamonds", "clubs"];

export default function FoundationPile({
  cards,
  pileIndex,
  selectedCardId,
  dragOverLocation,
  onCardClick,
  onEmptyClick,
  onDragOver,
  onDragLeave,
  onDrop,
}: FoundationPileProps) {
  const location: CardLocation = { pile: "foundation", index: pileIndex };
  const suit = FOUNDATION_SUITS[pileIndex];

  const isDragOver =
    dragOverLocation?.pile === "foundation" && dragOverLocation?.index === pileIndex;

  if (cards.length === 0) {
    return (
      <CardPlaceholder
        onClick={() => onEmptyClick(location)}
        className={`text-2xl ${SUIT_COLORS[suit]}`}
        isDragOver={isDragOver}
        onDragOver={onDragOver(location)}
        onDragLeave={onDragLeave}
        onDrop={onDrop(location)}
      >
        {SUIT_SYMBOLS[suit]}
      </CardPlaceholder>
    );
  }

  const topCard = cards[cards.length - 1];
  const isSelected = selectedCardId === topCard.id;

  return (
    <Card
      card={topCard}
      isSelected={isSelected}
      isPlayable={true}
      isDragOver={isDragOver}
      onClick={() => onCardClick(topCard, location)}
      onDragOver={onDragOver(location)}
      onDragLeave={onDragLeave}
      onDrop={onDrop(location)}
    />
  );
}
