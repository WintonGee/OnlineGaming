'use client';

import { Difficulty } from '../types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { RefreshCw, CheckCircle } from 'lucide-react';

interface SudokuControlsProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onNewGame: () => void;
  onCheckSolution: () => void;
  isGenerating?: boolean;
}

export default function SudokuControls({
  difficulty,
  onDifficultyChange,
  onNewGame,
  onCheckSolution,
  isGenerating = false,
}: SudokuControlsProps) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-md">
      {/* Difficulty Selector */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Difficulty Level</Label>
        <RadioGroup
          value={difficulty}
          onValueChange={(value) => onDifficultyChange(value as Difficulty)}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Easy" id="easy" />
            <Label htmlFor="easy" className="font-normal cursor-pointer">
              Easy
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Medium" id="medium" />
            <Label htmlFor="medium" className="font-normal cursor-pointer">
              Medium
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Hard" id="hard" />
            <Label htmlFor="hard" className="font-normal cursor-pointer">
              Hard
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <Button
          onClick={onNewGame}
          disabled={isGenerating}
          size="lg"
          className="w-full"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              New Game
            </>
          )}
        </Button>

        <Button
          onClick={onCheckSolution}
          variant="outline"
          size="lg"
          className="w-full"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Check Solution
        </Button>
      </div>
    </div>
  );
}
