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
import { X } from "lucide-react";

interface GameOverDialogProps {
  open: boolean;
  score: number;
  onNewGame: () => void;
}

export default function GameOverDialog({
  open,
  score,
  onNewGame,
}: GameOverDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onNewGame()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 dark:bg-red-900 p-4 rounded-full">
              <X className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            Game Over!
          </DialogTitle>
          <DialogDescription className="text-center">
            No more moves available. Your score: {score}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={onNewGame} className="w-full">
            Try Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
