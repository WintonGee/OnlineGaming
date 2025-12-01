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
import { Frown } from "lucide-react";

interface GameOverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  solution: string;
  onNewGame: () => void;
}

export default function GameOverDialog({
  open,
  onOpenChange,
  solution,
  onNewGame,
}: GameOverDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 dark:bg-red-900 p-4 rounded-full">
              <Frown className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Game Over</DialogTitle>
          <DialogDescription className="text-center">
            You ran out of guesses!
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">The word was:</p>
          <p className="text-3xl font-bold font-mono text-black dark:text-white">
            {solution}
          </p>
        </div>

        <DialogFooter>
          <Button onClick={onNewGame} className="w-full">
            New Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
