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
import { Trophy } from "lucide-react";

interface WinDialogProps {
  open: boolean;
  onContinue: () => void;
  onNewGame: () => void;
}

export default function WinDialog({
  open,
  onContinue,
  onNewGame,
}: WinDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-full">
              <Trophy className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            You Win!
          </DialogTitle>
          <DialogDescription className="text-center">
            Congratulations! You reached the 2048 tile!
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button onClick={onContinue} variant="outline" className="w-full">
            Keep Playing
          </Button>
          <Button onClick={onNewGame} className="w-full">
            New Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
