"use client";

import { Card as CardType, Difficulty, CustomSettings } from "../types";
import { getConfigForDifficulty } from "../constants";
import Card from "./Card";
import { cn } from "@/lib/utils/cn";

interface GameBoardProps {
  cards: CardType[];
  difficulty: Difficulty;
  customSettings?: CustomSettings;
  disabled: boolean;
  onCardClick: (index: number) => void;
}

// Determine card size variant based on grid dimensions
function getCardSize(cols: number, rows: number): "normal" | "small" | "tiny" | "micro" {
  const maxDimension = Math.max(cols, rows);
  if (maxDimension <= 5) return "normal";
  if (maxDimension <= 7) return "small";
  if (maxDimension <= 9) return "tiny";
  return "micro";
}

// Get max width based on number of columns
function getMaxWidth(cols: number): string {
  if (cols <= 4) return "max-w-sm";
  if (cols <= 5) return "max-w-md";
  if (cols <= 6) return "max-w-lg";
  if (cols <= 8) return "max-w-xl";
  if (cols <= 10) return "max-w-2xl";
  return "max-w-3xl";
}

export default function GameBoard({
  cards,
  difficulty,
  customSettings,
  disabled,
  onCardClick,
}: GameBoardProps) {
  const config = getConfigForDifficulty(difficulty, customSettings);
  const cardSize = getCardSize(config.cols, config.rows);
  const maxWidth = getMaxWidth(config.cols);

  // Gap sizes based on card density
  const gapClass = cardSize === "micro" ? "gap-0.5 sm:gap-1"
    : cardSize === "tiny" ? "gap-1 sm:gap-1.5"
    : cardSize === "small" ? "gap-1.5 sm:gap-2"
    : "gap-2 sm:gap-3";

  return (
    <div
      className={cn(
        "grid mx-auto w-full",
        maxWidth,
        gapClass
      )}
      style={{
        gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
        aspectRatio: `${config.cols} / ${config.rows}`,
      }}
      role="grid"
      aria-label="Memory game board"
    >
      {cards.map((card, index) => (
        <Card
          key={card.id}
          card={card}
          size={cardSize}
          onClick={() => onCardClick(index)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
