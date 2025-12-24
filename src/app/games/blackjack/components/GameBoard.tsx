"use client";

import { Hand as HandType, GamePhase, GameResult } from "../types";
import Hand from "./Hand";
import ActionButtons from "./ActionButtons";

interface GameBoardProps {
  playerHand: HandType;
  dealerHand: HandType;
  gamePhase: GamePhase;
  gameResult: GameResult;
  isAIThinking: boolean;
  onHit: () => void;
  onStand: () => void;
  statusMessage: string;
}

const RESULT_STYLES: Record<string, string> = {
  playerWin: "text-green-600 dark:text-green-400",
  blackjack: "text-green-600 dark:text-green-400",
  dealerWin: "text-red-600 dark:text-red-400",
  push: "text-yellow-600 dark:text-yellow-400",
  default: "text-gray-700 dark:text-gray-300",
};

export default function GameBoard({
  playerHand,
  dealerHand,
  gamePhase,
  gameResult,
  isAIThinking,
  onHit,
  onStand,
  statusMessage,
}: GameBoardProps) {
  const statusStyle = RESULT_STYLES[gameResult || "default"];

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-2xl p-6 bg-gray-100 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 min-h-[400px] flex flex-col justify-between gap-4">
        <Hand
          cards={dealerHand.cards}
          label="Dealer"
          score={gamePhase !== "playing" && gamePhase !== "dealing" ? dealerHand.score : undefined}
          isActive={gamePhase === "dealerTurn"}
        />

        <div className="text-center">
          <p className={`text-lg font-semibold ${statusStyle}`}>
            {statusMessage}
          </p>
        </div>

        <div className="space-y-4">
          <Hand
            cards={playerHand.cards}
            label="You"
            score={playerHand.score}
            isActive={gamePhase === "playing"}
          />

          {gamePhase === "playing" && (
            <ActionButtons onHit={onHit} onStand={onStand} disabled={isAIThinking} />
          )}
        </div>
      </div>
    </div>
  );
}
