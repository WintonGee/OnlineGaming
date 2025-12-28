import { Card as CardType, GamePhase, GuessResult } from "../types";
import Card from "./Card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface GameBoardProps {
  currentCard: CardType;
  nextCard: CardType | null;
  gamePhase: GamePhase;
  lastResult: GuessResult;
  streak: number;
  onGuess: (guess: "higher" | "lower") => void;
}

export default function GameBoard({
  currentCard,
  nextCard,
  gamePhase,
  lastResult,
  streak,
  onGuess
}: GameBoardProps) {
  const isRevealing = gamePhase === "revealing";
  const isPlaying = gamePhase === "playing";
  const isGameOver = gamePhase === "gameOver";

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Cards Display */}
      <div className="flex items-center gap-6 sm:gap-12">
        {/* Current Card */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Current</span>
          <Card card={currentCard} faceDown={false} />
        </div>

        {/* Arrow indicator */}
        <div className="text-4xl text-gray-400 dark:text-gray-600">→</div>

        {/* Next Card (face down or revealed) */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Next</span>
          {nextCard ? (
            <Card
              card={{
                ...nextCard,
                isFlipping: isRevealing,
              }}
              faceDown={!isRevealing && !isGameOver}
            />
          ) : (
            <div className="w-24 h-36 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600" />
          )}
        </div>
      </div>

      {/* Result message */}
      {isRevealing && (
        <div className={cn(
          "text-2xl font-bold animate-pulse",
          lastResult === "correct" || lastResult === "tie"
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
        )}>
          {lastResult === "correct" ? "Correct!" : lastResult === "tie" ? "Tie!" : "Wrong!"}
        </div>
      )}

      {/* Streak display */}
      <div className="bg-gray-200 dark:bg-gray-800 rounded-full px-6 py-2">
        <span className="text-lg font-bold text-black dark:text-white">
          Streak: {streak}
        </span>
      </div>

      {/* Guess buttons */}
      <div className="flex gap-4">
        <Button
          onClick={() => onGuess("higher")}
          disabled={!isPlaying}
          size="lg"
          className="flex items-center gap-2 px-8 py-6 text-lg rounded-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          <ArrowUp className="w-6 h-6" />
          Higher
        </Button>
        <Button
          onClick={() => onGuess("lower")}
          disabled={!isPlaying}
          size="lg"
          className="flex items-center gap-2 px-8 py-6 text-lg rounded-full bg-red-600 hover:bg-red-700 disabled:opacity-50"
        >
          <ArrowDown className="w-6 h-6" />
          Lower
        </Button>
      </div>
    </div>
  );
}
