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
import { Info } from "lucide-react";
import { GameObjective } from "./instructions/GameObjective";
import { BasicControls } from "./instructions/BasicControls";
import { InputModes } from "./instructions/InputModes";
import { AdvancedFeatures } from "./instructions/AdvancedFeatures";
import { StrategyTips } from "./instructions/StrategyTips";
import { DifficultyLevels } from "./instructions/DifficultyLevels";

interface InstructionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InstructionsDialog({
  open,
  onOpenChange,
}: InstructionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl bg-white dark:bg-black border-gray-300 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-serif font-bold text-black dark:text-white flex items-center gap-3">
            <div className="bg-black dark:bg-white rounded-lg p-2">
              <Info className="h-6 w-6 text-white dark:text-black" />
            </div>
            How to Play Sudoku
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 dark:text-gray-400 pt-2">
            Master the classic puzzle game with this comprehensive guide
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 text-gray-700 dark:text-gray-300 py-4">
          <GameObjective />
          <BasicControls />
          <InputModes />
          <AdvancedFeatures />
          <StrategyTips />
          <DifficultyLevels />
        </div>

        <DialogFooter className="border-t border-gray-200 dark:border-gray-800 pt-4">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black"
          >
            Got it! Let&apos;s Play
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
