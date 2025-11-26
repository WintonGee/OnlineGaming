import { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Difficulty, CustomSettings } from '../types';
import { CUSTOM_CONSTRAINTS } from '../constants';
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
  const [customWidth, setCustomWidth] = useState(currentCustomSettings?.width.toString() || '16');
  const [customHeight, setCustomHeight] = useState(currentCustomSettings?.height.toString() || '16');
  const [customMines, setCustomMines] = useState(currentCustomSettings?.mines.toString() || '40');
  const [customError, setCustomError] = useState<string>('');

  // Update form values when dialog opens or custom settings change
  useEffect(() => {
    if (open) {
      setCustomWidth(currentCustomSettings?.width.toString() || '16');
      setCustomHeight(currentCustomSettings?.height.toString() || '16');
      setCustomMines(currentCustomSettings?.mines.toString() || '40');
      setCustomError('');
    }
  }, [open, currentCustomSettings]);

  const handleStartGame = () => {
    const width = parseInt(customWidth);
    const height = parseInt(customHeight);
    const mines = parseInt(customMines);

    const validation = validateCustomSettings(width, height, mines);
    if (!validation.valid) {
      setCustomError(validation.error || 'Invalid settings');
      return;
    }

    onStartGame('Custom', { width, height, mines });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Custom Game Settings</DialogTitle>
          <DialogDescription>
            Configure your custom minesweeper game
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
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
              Mines: up to 80% of cells (20% safe tiles minimum)
            </p>
            {customError && (
              <p className="text-sm text-red-500 dark:text-red-400">{customError}</p>
            )}
          </div>
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
