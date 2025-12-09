"use client";

import { Card as CardType, Difficulty } from "../types";
import { DIFFICULTY_CONFIG } from "../constants";
import Card from "./Card";
import { cn } from "@/lib/utils/cn";

interface GameBoardProps {
  cards: CardType[];
  difficulty: Difficulty;
  disabled: boolean;
  onCardClick: (index: number) => void;
}

export default function GameBoard({
  cards,
  difficulty,
  disabled,
  onCardClick,
}: GameBoardProps) {
  const config = DIFFICULTY_CONFIG[difficulty];

  return (
    <div
      className={cn(
        "grid gap-2 sm:gap-3 mx-auto w-full max-w-md",
        difficulty === "easy" && "grid-cols-4",
        difficulty === "medium" && "grid-cols-4",
        difficulty === "hard" && "grid-cols-5"
      )}
      style={{
        aspectRatio: `${config.cols} / ${config.rows}`,
      }}
      role="grid"
      aria-label="Memory game board"
    >
      {cards.map((card, index) => (
        <Card
          key={card.id}
          card={card}
          onClick={() => onCardClick(index)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
