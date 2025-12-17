"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Frown, Skull, X } from "lucide-react";

/**
 * Shared GameOverDialog component for displaying game over states
 *
 * @example
 * // Simple game over (2048 style)
 * <GameOverDialog
 *   open={gameOver}
 *   onOpenChange={setGameOver}
 *   message="No more moves available."
 *   score={score}
 *   onNewGame={startNewGame}
 * />
 *
 * @example
 * // Game over with high score (Snake style)
 * <GameOverDialog
 *   open={gameOver}
 *   onOpenChange={setGameOver}
 *   icon="skull"
 *   message="The snake crashed!"
 *   score={score}
 *   highScore={highScore}
 *   onNewGame={startNewGame}
 * />
 *
 * @example
 * // Game over with solution reveal (Hangman style)
 * <GameOverDialog
 *   open={gameOver}
 *   onOpenChange={setGameOver}
 *   icon="frown"
 *   message="You ran out of guesses!"
 *   solution={word}
 *   onNewGame={startNewGame}
 * />
 */

type IconType = "x" | "skull" | "frown";

interface BaseGameOverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message?: string;
  icon?: IconType;
  onNewGame: () => void;
  buttonText?: string;
}

interface GameOverDialogWithScore extends BaseGameOverDialogProps {
  score: number;
  highScore?: number;
}

interface GameOverDialogWithSolution extends BaseGameOverDialogProps {
  solution: string;
}

interface GameOverDialogSimple extends BaseGameOverDialogProps {
  score?: never;
  highScore?: never;
  solution?: never;
}

type GameOverDialogProps =
  | GameOverDialogWithScore
  | GameOverDialogWithSolution
  | GameOverDialogSimple;

function isGameOverWithScore(
  props: GameOverDialogProps
): props is GameOverDialogWithScore {
  return "score" in props && typeof props.score === "number";
}

function isGameOverWithSolution(
  props: GameOverDialogProps
): props is GameOverDialogWithSolution {
  return "solution" in props && typeof props.solution === "string";
}

const IconComponent = ({ icon }: { icon: IconType }) => {
  switch (icon) {
    case "skull":
      return <Skull className="h-12 w-12 text-red-600 dark:text-red-400" />;
    case "frown":
      return <Frown className="h-12 w-12 text-red-600 dark:text-red-400" />;
    case "x":
    default:
      return <X className="h-12 w-12 text-red-600 dark:text-red-400" />;
  }
};

export default function GameOverDialog(props: GameOverDialogProps) {
  const {
    open,
    onOpenChange,
    title = "Game Over",
    message,
    icon = "x",
    onNewGame,
    buttonText = "Play Again",
  } = props;

  // Check for high score (only for score variant)
  const isNewHighScore =
    isGameOverWithScore(props) &&
    props.score > 0 &&
    props.highScore !== undefined &&
    props.score >= props.highScore;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-black border-gray-300 dark:border-gray-700">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full">
              <IconComponent icon={icon} />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-serif text-black dark:text-white">
            {title}
          </DialogTitle>
          {message && (
            <DialogDescription className="text-center text-gray-600 dark:text-gray-400">
              {message}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Score display */}
        {isGameOverWithScore(props) && (
          <div className="space-y-4 py-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Your Score
              </div>
              <div className="text-4xl font-bold text-black dark:text-white">
                {props.score}
              </div>
            </div>

            {isNewHighScore && props.score > 0 && (
              <div className="text-center text-green-600 dark:text-green-400 font-semibold">
                New High Score!
              </div>
            )}

            {!isNewHighScore &&
              props.highScore !== undefined &&
              props.highScore > 0 && (
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    High Score
                  </div>
                  <div className="text-xl font-bold text-black dark:text-white">
                    {props.highScore}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Solution display */}
        {isGameOverWithSolution(props) && (
          <div className="py-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">The word was:</p>
            <p className="text-3xl font-bold font-mono text-black dark:text-white">
              {props.solution}
            </p>
          </div>
        )}

        <DialogFooter>
          <Button onClick={onNewGame} className="w-full">
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
