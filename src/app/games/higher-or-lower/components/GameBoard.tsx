import { Card as CardType, GamePhase, GuessResult } from "../types";
import Card from "./Card";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface GameBoardProps {
  currentCard: CardType;
  nextCard: CardType | null;
  gamePhase: GamePhase;
  lastResult: GuessResult;
  onGuess: (guess: "higher" | "lower") => void;
}

const RESULT_STYLES: Record<string, string> = {
  correct: "text-green-600 dark:text-green-400",
  tie: "text-green-600 dark:text-green-400",
  wrong: "text-red-600 dark:text-red-400",
  default: "text-gray-700 dark:text-gray-300",
};

export default function GameBoard({
  currentCard,
  nextCard,
  gamePhase,
  lastResult,
  onGuess,
}: GameBoardProps) {
  const isRevealing = gamePhase === "revealing";
  const isPlaying = gamePhase === "playing";
  const isGameOver = gamePhase === "gameOver";

  const getStatusMessage = () => {
    if (isRevealing) {
      if (lastResult === "correct") return "Correct!";
      if (lastResult === "tie") return "Tie! You continue.";
      return "Wrong!";
    }
    if (isGameOver) return "Game Over";
    return "Higher or Lower?";
  };

  const statusStyle = RESULT_STYLES[lastResult || "default"];

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-2xl p-6 bg-gray-100 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 min-h-[420px] flex flex-col justify-between gap-6">
        {/* Cards Display */}
        <div className="flex items-center justify-center gap-4 sm:gap-8">
          {/* Current Card */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Current
            </span>
            <Card card={currentCard} />
          </div>

          {/* Arrow indicator */}
          <div className="text-3xl text-gray-400 dark:text-gray-600 font-light">
            →
          </div>

          {/* Next Card */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Next
            </span>
            {nextCard ? (
              <Card
                card={{
                  ...nextCard,
                  isFlipping: isRevealing,
                }}
                faceDown={!isRevealing && !isGameOver}
              />
            ) : (
              <div className="w-20 h-28 sm:w-24 sm:h-36 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600" />
            )}
          </div>
        </div>

        {/* Status Message */}
        <div className="text-center">
          <p className={cn("text-lg font-semibold", statusStyle)}>
            {getStatusMessage()}
          </p>
        </div>

        {/* Guess Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => onGuess("higher")}
            disabled={!isPlaying}
            size="lg"
            className={cn(
              "flex-1 max-w-[140px] flex items-center justify-center gap-2 py-5 rounded-xl font-semibold transition-all",
              "bg-green-600 hover:bg-green-700 text-white",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <ChevronUp className="w-5 h-5" />
            Higher
          </Button>
          <Button
            onClick={() => onGuess("lower")}
            disabled={!isPlaying}
            size="lg"
            className={cn(
              "flex-1 max-w-[140px] flex items-center justify-center gap-2 py-5 rounded-xl font-semibold transition-all",
              "bg-red-600 hover:bg-red-700 text-white",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <ChevronDown className="w-5 h-5" />
            Lower
          </Button>
        </div>
      </div>
    </div>
  );
}
