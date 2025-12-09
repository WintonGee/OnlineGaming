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
import { Skull } from "lucide-react";

interface GameOverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  score: number;
  highScore: number;
  onNewGame: () => void;
}

export default function GameOverDialog({
  open,
  onOpenChange,
  score,
  highScore,
  onNewGame,
}: GameOverDialogProps) {
  const isNewHighScore = score > 0 && score >= highScore;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-black border-gray-300 dark:border-gray-700">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full">
              <Skull className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-serif text-black dark:text-white">
            Game Over
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 dark:text-gray-400">
            The snake crashed!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Your Score
            </div>
            <div className="text-4xl font-bold text-black dark:text-white">
              {score}
            </div>
          </div>

          {isNewHighScore && score > 0 && (
            <div className="text-center text-green-600 dark:text-green-400 font-semibold">
              New High Score!
            </div>
          )}

          {!isNewHighScore && highScore > 0 && (
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                High Score
              </div>
              <div className="text-xl font-bold text-black dark:text-white">
                {highScore}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onNewGame} className="w-full">
            Play Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
