"use client";

import InstructionsDialogBase from "@/components/games/InstructionsDialog";
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
    <InstructionsDialogBase
      open={open}
      onOpenChange={onOpenChange}
      title={
        <div className="text-3xl font-serif font-bold text-black dark:text-white flex items-center gap-3">
          <div className="bg-black dark:bg-white rounded-lg p-2">
            <Info className="h-6 w-6 text-white dark:text-black" />
          </div>
          How to Play Sudoku
        </div>
      }
      description="Master the classic puzzle game with this comprehensive guide"
      maxWidth="3xl"
      buttonText="Got it! Let's Play"
      buttonClassName="w-full sm:w-auto bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black"
    >
      <div className="space-y-6 text-gray-700 dark:text-gray-300 py-4">
        <GameObjective />
        <BasicControls />
        <InputModes />
        <AdvancedFeatures />
        <StrategyTips />
        <DifficultyLevels />
      </div>
    </InstructionsDialogBase>
  );
}
