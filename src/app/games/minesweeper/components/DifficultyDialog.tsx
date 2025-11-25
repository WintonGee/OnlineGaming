import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Difficulty, CustomSettings } from '../types';
import { DIFFICULTY_CONFIG, CUSTOM_CONSTRAINTS } from '../constants';
import { validateCustomSettings } from '../logic/gameValidation';

interface DifficultyDialogProps {
  open: boolean;
  currentDifficulty: Difficulty;
  currentCustomSettings?: CustomSettings;
  onClose: () => void;
  onStartGame: (difficulty: Difficulty, customSettings?: CustomSettings) => void;
}

export default function DifficultyDialog({
  open,
  currentDifficulty,
  currentCustomSettings,
  onClose,
  onStartGame,
}: DifficultyDialogProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(currentDifficulty);
  const [customWidth, setCustomWidth] = useState(currentCustomSettings?.width.toString() || '16');
  const [customHeight, setCustomHeight] = useState(currentCustomSettings?.height.toString() || '16');
  const [customMines, setCustomMines] = useState(currentCustomSettings?.mines.toString() || '40');
  const [customError, setCustomError] = useState<string>('');

  const handleStartGame = () => {
    if (selectedDifficulty === 'Custom') {
      const width = parseInt(customWidth);
      const height = parseInt(customHeight);
      const mines = parseInt(customMines);

      const validation = validateCustomSettings(width, height, mines);
      if (!validation.valid) {
        setCustomError(validation.error || 'Invalid settings');
        return;
      }

      onStartGame('Custom', { width, height, mines });
    } else {
      onStartGame(selectedDifficulty);
    }
    onClose();
  };

  const handleDifficultyChange = (value: string) => {
    setSelectedDifficulty(value as Difficulty);
    setCustomError('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Difficulty</DialogTitle>
          <DialogDescription>
            Choose a difficulty level or create a custom game
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <RadioGroup value={selectedDifficulty} onValueChange={handleDifficultyChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Beginner" id="beginner" />
              <Label htmlFor="beginner" className="flex-1 cursor-pointer">
                Beginner
                <span className="text-sm text-muted-foreground ml-2">
                  ({DIFFICULTY_CONFIG.Beginner.width}x{DIFFICULTY_CONFIG.Beginner.height}, {DIFFICULTY_CONFIG.Beginner.mines} mines)
                </span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Intermediate" id="intermediate" />
              <Label htmlFor="intermediate" className="flex-1 cursor-pointer">
                Intermediate
                <span className="text-sm text-muted-foreground ml-2">
                  ({DIFFICULTY_CONFIG.Intermediate.width}x{DIFFICULTY_CONFIG.Intermediate.height}, {DIFFICULTY_CONFIG.Intermediate.mines} mines)
                </span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Expert" id="expert" />
              <Label htmlFor="expert" className="flex-1 cursor-pointer">
                Expert
                <span className="text-sm text-muted-foreground ml-2">
                  ({DIFFICULTY_CONFIG.Expert.width}x{DIFFICULTY_CONFIG.Expert.height}, {DIFFICULTY_CONFIG.Expert.mines} mines)
                </span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Custom" id="custom" />
              <Label htmlFor="custom" className="flex-1 cursor-pointer">
                Custom
              </Label>
            </div>
          </RadioGroup>

          {selectedDifficulty === 'Custom' && (
            <div className="space-y-3 pl-6 border-l-2 border-gray-300 dark:border-gray-600">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="width" className="text-sm">Width</Label>
                  <Input
                    id="width"
                    type="number"
                    min={CUSTOM_CONSTRAINTS.minWidth}
                    max={CUSTOM_CONSTRAINTS.maxWidth}
                    value={customWidth}
                    onChange={(e) => setCustomWidth(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="height" className="text-sm">Height</Label>
                  <Input
                    id="height"
                    type="number"
                    min={CUSTOM_CONSTRAINTS.minHeight}
                    max={CUSTOM_CONSTRAINTS.maxHeight}
                    value={customHeight}
                    onChange={(e) => setCustomHeight(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="mines" className="text-sm">Mines</Label>
                  <Input
                    id="mines"
                    type="number"
                    min={1}
                    value={customMines}
                    onChange={(e) => setCustomMines(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Size: {CUSTOM_CONSTRAINTS.minWidth}-{CUSTOM_CONSTRAINTS.maxWidth} x {CUSTOM_CONSTRAINTS.minHeight}-{CUSTOM_CONSTRAINTS.maxHeight},
                Mines: up to 99% of cells
              </p>
              {customError && (
                <p className="text-sm text-red-500 dark:text-red-400">{customError}</p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleStartGame}>
            Start Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
