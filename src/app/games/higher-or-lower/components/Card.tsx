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

  // Flipping card (3D flip animation)
  if (isFlipping) {
    return (
      <div className={cn("card-container w-20 h-28 sm:w-24 sm:h-36", isNew && "card-new")}>
        <div className="card-inner flipping">
          {/* Back of card */}
          <div className="card-back w-20 h-28 sm:w-24 sm:h-36 rounded-lg bg-gray-200 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 shadow-md flex items-center justify-center">
            <div className="text-gray-400 dark:text-gray-500 text-3xl sm:text-4xl">♠</div>
          </div>
          {/* Front of card */}
          <div className="card-front w-20 h-28 sm:w-24 sm:h-36 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 shadow-md overflow-hidden">
            <div className={cn("absolute top-1 left-1.5 text-xs font-bold leading-tight", textColor)}>
              <div>{rank}</div>
              <div className="-mt-0.5">{SUIT_SYMBOLS[suit]}</div>
            </div>
            <div className={cn("w-full h-full flex items-center justify-center text-4xl sm:text-5xl", textColor)}>
              {SUIT_SYMBOLS[suit]}
            </div>
            <div className={cn("absolute bottom-1 right-1.5 text-xs font-bold leading-tight rotate-180", textColor)}>
              <div>{rank}</div>
              <div className="-mt-0.5">{SUIT_SYMBOLS[suit]}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Face-down card
  if (faceDown) {
    return (
      <div className={cn(
        "w-20 h-28 sm:w-24 sm:h-36 rounded-lg bg-gray-200 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 shadow-md flex items-center justify-center",
        isNew && "card-new"
      )}>
        <div className="text-gray-400 dark:text-gray-500 text-3xl sm:text-4xl">♠</div>
      </div>
    );
  }

  // Face-up card
  return (
    <div className={cn(
      "relative w-20 h-28 sm:w-24 sm:h-36 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 shadow-md overflow-hidden",
      isNew && "card-new"
    )}>
      <div className={cn("absolute top-1 left-1.5 text-xs font-bold leading-tight", textColor)}>
        <div>{rank}</div>
        <div className="-mt-0.5">{SUIT_SYMBOLS[suit]}</div>
      </div>
      <div className={cn("w-full h-full flex items-center justify-center text-4xl sm:text-5xl", textColor)}>
        {SUIT_SYMBOLS[suit]}
      </div>
      <div className={cn("absolute bottom-1 right-1.5 text-xs font-bold leading-tight rotate-180", textColor)}>
        <div>{rank}</div>
        <div className="-mt-0.5">{SUIT_SYMBOLS[suit]}</div>
      </div>
    </div>
  );
}
