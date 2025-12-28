import { Card as CardType } from "../types";
import { cn } from "@/lib/utils/cn";

interface CardProps {
  card: CardType;
  faceDown?: boolean;
}

const SUIT_SYMBOLS: Record<CardType["suit"], string> = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};

export default function Card({ card, faceDown = false }: CardProps) {
  const { suit, rank, isNew, isFlipping } = card;
  const isRed = suit === "hearts" || suit === "diamonds";
  const textColor = isRed ? "text-red-600 dark:text-red-500" : "text-black dark:text-white";

  // Flipping card (3D flip animation) - reveals the card
  if (isFlipping) {
    return (
      <div className={cn("card-container w-24 h-36", isNew && "card-new")}>
        <div className="card-inner flipping">
          {/* Back of card (visible initially) */}
          <div className="card-back w-24 h-36 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-950 border-2 border-blue-800 dark:border-blue-700 shadow-lg flex items-center justify-center">
            <div className="text-blue-300 dark:text-blue-400 text-5xl">♠</div>
          </div>
          {/* Front of card (revealed after flip) */}
          <div className="card-front w-24 h-36 rounded-lg bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 shadow-lg overflow-hidden">
            {/* Top-left corner */}
            <div className={cn("absolute top-1 left-1.5 text-xs font-bold leading-tight", textColor)}>
              <div>{rank}</div>
              <div className="-mt-0.5">{SUIT_SYMBOLS[suit]}</div>
            </div>
            {/* Center suit - larger */}
            <div className={cn("w-full h-full flex items-center justify-center text-6xl", textColor)}>
              {SUIT_SYMBOLS[suit]}
            </div>
            {/* Bottom-right corner (rotated) */}
            <div className={cn("absolute bottom-1 right-1.5 text-xs font-bold leading-tight rotate-180", textColor)}>
              <div>{rank}</div>
              <div className="-mt-0.5">{SUIT_SYMBOLS[suit]}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Face-down card (hidden)
  if (faceDown) {
    return (
      <div className={cn(
        "w-24 h-36 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-950 border-2 border-blue-800 dark:border-blue-700 shadow-lg flex items-center justify-center",
        isNew && "card-new"
      )}>
        <div className="text-blue-300 dark:text-blue-400 text-5xl">♠</div>
      </div>
    );
  }

  // Face-up card (revealed)
  return (
    <div className={cn(
      "relative w-24 h-36 rounded-lg bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 shadow-lg overflow-hidden",
      isNew && "card-new"
    )}>
      {/* Top-left corner */}
      <div className={cn("absolute top-1 left-1.5 text-xs font-bold leading-tight", textColor)}>
        <div>{rank}</div>
        <div className="-mt-0.5">{SUIT_SYMBOLS[suit]}</div>
      </div>
      {/* Center suit - larger */}
      <div className={cn("w-full h-full flex items-center justify-center text-6xl", textColor)}>
        {SUIT_SYMBOLS[suit]}
      </div>
      {/* Bottom-right corner (rotated) */}
      <div className={cn("absolute bottom-1 right-1.5 text-xs font-bold leading-tight rotate-180", textColor)}>
        <div>{rank}</div>
        <div className="-mt-0.5">{SUIT_SYMBOLS[suit]}</div>
      </div>
    </div>
  );
}
