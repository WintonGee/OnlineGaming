"use client";

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
import { CustomSettings } from '../types';
import { CUSTOM_CONSTRAINTS, validateCustomSettings } from '../constants';

interface CustomModeDialogProps {
  open: boolean;
  currentCustomSettings?: CustomSettings;
  onClose: () => void;
  onStartGame: (customSettings: CustomSettings) => void;
}

const PRESET_SIZES = [
  { label: "4×4", rows: 4, cols: 4, description: "16 cards" },
  { label: "5×4", rows: 5, cols: 4, description: "20 cards" },
  { label: "6×5", rows: 6, cols: 5, description: "30 cards" },
  { label: "6×6", rows: 6, cols: 6, description: "36 cards" },
  { label: "8×6", rows: 8, cols: 6, description: "48 cards" },
  { label: "8×8", rows: 8, cols: 8, description: "64 cards" },
  { label: "10×8", rows: 10, cols: 8, description: "80 cards" },
  { label: "10×10", rows: 10, cols: 10, description: "100 cards" },
  { label: "12×10", rows: 12, cols: 10, description: "120 cards" },
  { label: "12×12", rows: 12, cols: 12, description: "144 cards (Extreme!)" },
];

export default function CustomModeDialog({
  open,
  currentCustomSettings,
  onClose,
  onStartGame,
}: CustomModeDialogProps) {
  const [rows, setRows] = useState(currentCustomSettings?.rows.toString() || '4');
  const [cols, setCols] = useState(currentCustomSettings?.cols.toString() || '4');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (open) {
      setRows(currentCustomSettings?.rows.toString() || '4');
      setCols(currentCustomSettings?.cols.toString() || '4');
      setError('');
    }
  }, [open, currentCustomSettings]);

  const handleStartGame = () => {
    const rowsNum = parseInt(rows);
    const colsNum = parseInt(cols);

    const validation = validateCustomSettings(rowsNum, colsNum);
    if (!validation.valid) {
      setError(validation.error || 'Invalid settings');
      return;
    }

    onStartGame({ rows: rowsNum, cols: colsNum });
    onClose();
  };

  const handlePresetClick = (preset: typeof PRESET_SIZES[0]) => {
    setRows(preset.rows.toString());
    setCols(preset.cols.toString());
    setError('');
  };

  const totalCards = (parseInt(rows) || 0) * (parseInt(cols) || 0);
  const pairs = Math.floor(totalCards / 2);
  const isValidTotal = totalCards > 0 && totalCards % 2 === 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Custom Grid Size</DialogTitle>
          <DialogDescription>
            Choose a preset or enter custom dimensions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Preset Sizes */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Quick Presets</Label>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_SIZES.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className={`
                    px-2 py-2 text-xs font-medium rounded-lg border-2 transition-all
                    ${rows === preset.rows.toString() && cols === preset.cols.toString()
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }
                  `}
                  title={preset.description}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Input */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Custom Dimensions</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rows" className="text-xs text-gray-500">Rows</Label>
                <Input
                  id="rows"
                  type="number"
                  min={CUSTOM_CONSTRAINTS.minRows}
                  max={CUSTOM_CONSTRAINTS.maxRows}
                  value={rows}
                  onChange={(e) => {
                    setRows(e.target.value);
                    setError('');
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cols" className="text-xs text-gray-500">Columns</Label>
                <Input
                  id="cols"
                  type="number"
                  min={CUSTOM_CONSTRAINTS.minCols}
                  max={CUSTOM_CONSTRAINTS.maxCols}
                  value={cols}
                  onChange={(e) => {
                    setCols(e.target.value);
                    setError('');
                  }}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3 space-y-1">
            <p className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Grid: </span>
              <span className="font-medium">{rows} × {cols}</span>
              {isValidTotal && (
                <>
                  <span className="text-gray-500 dark:text-gray-400"> = </span>
                  <span className="font-medium">{totalCards} cards</span>
                  <span className="text-gray-500 dark:text-gray-400"> ({pairs} pairs)</span>
                </>
              )}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Size: {CUSTOM_CONSTRAINTS.minRows}-{CUSTOM_CONSTRAINTS.maxRows} rows × {CUSTOM_CONSTRAINTS.minCols}-{CUSTOM_CONSTRAINTS.maxCols} cols.
              Total cards must be even.
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
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
