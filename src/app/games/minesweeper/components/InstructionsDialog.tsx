"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle className="text-2xl">How to Play Minesweeper</DialogTitle>
          <DialogDescription className="sr-only">
            Instructions for playing Minesweeper
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <h3 className="font-semibold text-base mb-2 text-gray-900 dark:text-gray-100">
              Objective
            </h3>
            <p>
              Reveal all cells that don't contain mines without detonating any mines!
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-2 text-gray-900 dark:text-gray-100">
              How to Play
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <span className="font-semibold">Left click:</span> Reveal a cell
              </li>
              <li>
                <span className="font-semibold">Right click:</span> Place or remove a flag
              </li>
              <li>
                <span className="font-semibold">Mobile:</span> Tap to reveal, long-press to flag
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-2 text-gray-900 dark:text-gray-100">
              Game Rules
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                Numbers indicate how many mines are adjacent to that cell (including diagonals)
              </li>
              <li>
                Empty cells (no number) have no adjacent mines and will auto-reveal nearby cells
              </li>
              <li>
                Use flags to mark cells you believe contain mines
              </li>
              <li>
                The counter shows remaining mines (total mines minus flags placed)
              </li>
              <li>
                The timer tracks how long you've been playing
              </li>
              <li>
                Game ends when you reveal a mine (lose) or reveal all safe cells (win)
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-2 text-gray-900 dark:text-gray-100">
              Difficulty Levels
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <span className="font-semibold">Beginner:</span> 9×9 grid with 10 mines
              </li>
              <li>
                <span className="font-semibold">Intermediate:</span> 16×16 grid with 40 mines
              </li>
              <li>
                <span className="font-semibold">Expert:</span> 30×16 grid with 99 mines
              </li>
              <li>
                <span className="font-semibold">Custom:</span> Create your own board size and mine count
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-2 text-gray-900 dark:text-gray-100">
              Tips
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Start by clicking in a corner or edge - statistically safer</li>
              <li>Use the process of elimination to deduce mine locations</li>
              <li>Look for patterns (e.g., 1-2-1 patterns indicate specific mine positions)</li>
              <li>Don't guess unless absolutely necessary - use logic first</li>
              <li>Flag all certain mines to help visualize remaining unknowns</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={() => onOpenChange(false)}>Got it!</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
