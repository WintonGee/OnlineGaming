import { Card as CardType } from "../types";
import { cn } from "@/lib/utils/cn";

interface CardProps {
  card: CardType;
}

const SUIT_SYMBOLS: Record<CardType["suit"], string> = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};

export default function Card({ card }: CardProps) {
  const { suit, rank, faceUp, isNew, isFlipping } = card;
  const isRed = suit === "hearts" || suit === "diamonds";
  const textColor = isRed ? "text-red-600 dark:text-red-500" : "text-black dark:text-white";

  // Flipping card (3D flip animation)
  if (isFlipping) {
    return (
      <div className={cn("card-container w-14 h-20", isNew && "card-new")}>
        <div className="card-inner flipping">
          {/* Back of card (visible initially) */}
          <div className="card-back w-14 h-20 rounded-lg bg-gray-200 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 shadow-md flex items-center justify-center">
            <div className="text-gray-400 dark:text-gray-500 text-2xl">♠</div>
          </div>
          {/* Front of card (revealed after flip) */}
          <div className="card-front w-14 h-20 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 shadow-md overflow-hidden">
            <div className={cn("absolute top-0.5 left-1 text-[10px] font-bold leading-tight", textColor)}>
              <div>{rank}</div>
              <div className="-mt-0.5">{SUIT_SYMBOLS[suit]}</div>
            </div>
            <div className={cn("w-full h-full flex items-center justify-center text-xl", textColor)}>
              {SUIT_SYMBOLS[suit]}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Face-down card (hidden)
  if (!faceUp) {
    return (
      <div className={cn(
        "w-14 h-20 rounded-lg bg-gray-200 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 shadow-md flex items-center justify-center",
        isNew && "card-new"
      )}>
        <div className="text-gray-400 dark:text-gray-500 text-2xl">♠</div>
      </div>
    );
  }

  // Face-up card (revealed)
  return (
    <div className={cn(
      "relative w-14 h-20 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 shadow-md overflow-hidden",
      isNew && "card-new"
    )}>
      {/* Top-left corner */}
      <div className={cn("absolute top-0.5 left-1 text-[10px] font-bold leading-tight", textColor)}>
        <div>{rank}</div>
        <div className="-mt-0.5">{SUIT_SYMBOLS[suit]}</div>
      </div>
      {/* Center suit */}
      <div className={cn("w-full h-full flex items-center justify-center text-xl", textColor)}>
        {SUIT_SYMBOLS[suit]}
      </div>
    </div>
  );
}
