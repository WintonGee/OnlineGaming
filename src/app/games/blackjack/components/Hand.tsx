import { Card as CardType } from "../types";
import Card from "./Card";

interface HandProps {
  cards: CardType[];
  label: string;
  score?: number;
  isActive?: boolean;
}

export default function Hand({ cards, label, score, isActive }: HandProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <h3
        className={`text-lg font-semibold ${
          isActive
            ? "text-black dark:text-white"
            : "text-gray-500 dark:text-gray-400"
        }`}
      >
        {label}
      </h3>

      <div className="flex">
        {cards.length > 0 ? (
          cards.map((card, i) => (
            <div key={`${card.suit}-${card.rank}-${i}`} style={{ marginLeft: i > 0 ? -30 : 0 }}>
              <Card card={card} />
            </div>
          ))
        ) : (
          <div className="text-gray-400 dark:text-gray-500 text-sm">No cards</div>
        )}
      </div>

      {score !== undefined && (
        <div
          className={`text-lg font-bold ${
            score > 21
              ? "text-red-600 dark:text-red-400"
              : score === 21
              ? "text-green-600 dark:text-green-400"
              : "text-black dark:text-white"
          }`}
        >
          {score}
        </div>
      )}
    </div>
  );
}
