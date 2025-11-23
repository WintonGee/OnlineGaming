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
import {
  Info,
  Target,
  Gamepad2,
  PenLine,
  Sparkles,
  Lightbulb,
  Grid3x3,
  MousePointer,
  Keyboard,
  ArrowUp,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

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
          {/* Objective */}
          <section className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-2 mt-0.5">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                  Game Objective
                </h3>
                <p className="leading-relaxed">
                  Fill the 9×9 grid so that every row, column, and 3×3 box
                  contains the digits 1-9 exactly once, without any
                  repetition. Some cells are pre-filled to give you a starting
                  point.
                </p>
              </div>
            </div>
          </section>

          {/* Basic Controls */}
          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-2">
                <Gamepad2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Basic Controls
              </h3>
            </div>
            <div className="grid gap-3 ml-11">
              <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
                <MousePointer className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-black dark:text-white">
                    Selecting Cells
                  </p>
                  <p className="text-sm mt-0.5">
                    Click or tap any empty cell to select it. The selected
                    cell will be highlighted.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
                <Grid3x3 className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-black dark:text-white">
                    Entering Numbers
                  </p>
                  <p className="text-sm mt-0.5">
                    Use the number pad below the grid or type 1-9 directly on
                    your keyboard.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
                <Keyboard className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-black dark:text-white">
                    Keyboard Navigation
                  </p>
                  <p className="text-sm mt-0.5">
                    Use{" "}
                    <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-200 dark:bg-gray-700 rounded mx-1">
                      ←
                    </kbd>
                    <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-200 dark:bg-gray-700 rounded mx-1">
                      ↑
                    </kbd>
                    <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-200 dark:bg-gray-700 rounded mx-1">
                      →
                    </kbd>
                    <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-200 dark:bg-gray-700 rounded mx-1">
                      ↓
                    </kbd>
                    arrow keys to move between cells
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
                <RotateCcw className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-black dark:text-white">
                    Undo & Clear
                  </p>
                  <p className="text-sm mt-0.5">
                    Press{" "}
                    <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-200 dark:bg-gray-700 rounded mx-1">
                      Backspace
                    </kbd>{" "}
                    or
                    <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-200 dark:bg-gray-700 rounded mx-1">
                      Delete
                    </kbd>{" "}
                    to clear a cell. Use{" "}
                    <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-200 dark:bg-gray-700 rounded mx-1">
                      Ctrl+Z
                    </kbd>{" "}
                    (
                    <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-200 dark:bg-gray-700 rounded mx-1">
                      ⌘Z
                    </kbd>{" "}
                    on Mac) to undo moves.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Input Modes */}
          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-2">
                <PenLine className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Input Modes
              </h3>
            </div>
            <div className="grid gap-3 ml-11">
              <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
                <p className="font-medium text-black dark:text-white mb-1">
                  Normal Mode
                </p>
                <p className="text-sm">
                  Enter your final answer for a cell. The number will appear
                  large and centered in the cell.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
                <p className="font-medium text-black dark:text-white mb-1">
                  Candidate Mode
                </p>
                <p className="text-sm">
                  Add small pencil marks to track possible numbers for a cell.
                  This is essential for advanced solving techniques. Toggle
                  between modes using the buttons below the grid.
                </p>
              </div>
            </div>
          </section>

          {/* Advanced Features */}
          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-2">
                <Sparkles className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Advanced Features
              </h3>
            </div>
            <div className="space-y-2 ml-11 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <p>
                  <strong className="text-black dark:text-white">
                    Auto Candidate Mode:
                  </strong>{" "}
                  Automatically fills in all possible candidates for empty
                  cells based on Sudoku rules. Toggle this feature using the
                  checkbox in the toolbar.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <p>
                  <strong className="text-black dark:text-white">
                    Check Cell:
                  </strong>{" "}
                  Verify if the currently selected cell has the correct value.
                  Incorrect cells will be highlighted in red.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <p>
                  <strong className="text-black dark:text-white">
                    Check Puzzle:
                  </strong>{" "}
                  Check all cells at once to see if any of your entries are
                  incorrect.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <p>
                  <strong className="text-black dark:text-white">
                    Reveal Cell:
                  </strong>{" "}
                  Shows the correct value for the selected cell when
                  you&apos;re stuck.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <p>
                  <strong className="text-black dark:text-white">
                    Reveal Puzzle:
                  </strong>{" "}
                  Fills in the entire solution. Useful if you want to see the
                  answer.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <p>
                  <strong className="text-black dark:text-white">
                    Reset Puzzle:
                  </strong>{" "}
                  Clears all your entries and notes to start fresh with the
                  same puzzle.
                </p>
              </div>
            </div>
          </section>

          {/* Strategy Tips */}
          <section className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start gap-3">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-2 mt-0.5">
                <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-3">
                  Solving Strategies & Tips
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 dark:text-yellow-400 font-bold mt-0.5">
                      •
                    </span>
                    <span>
                      <strong className="text-black dark:text-white">
                        Start with the obvious:
                      </strong>{" "}
                      Look for rows, columns, or 3×3 boxes that already have
                      many numbers filled in. These are easier to complete.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 dark:text-yellow-400 font-bold mt-0.5">
                      •
                    </span>
                    <span>
                      <strong className="text-black dark:text-white">
                        Use candidates wisely:
                      </strong>{" "}
                      When you&apos;re unsure, switch to Candidate Mode and
                      mark all possible numbers for a cell. This helps
                      visualize your options.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 dark:text-yellow-400 font-bold mt-0.5">
                      •
                    </span>
                    <span>
                      <strong className="text-black dark:text-white">
                        Find naked singles:
                      </strong>{" "}
                      Look for cells that can only contain one possible number
                      based on the numbers already in its row, column, and
                      box.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 dark:text-yellow-400 font-bold mt-0.5">
                      •
                    </span>
                    <span>
                      <strong className="text-black dark:text-white">
                        Hidden singles:
                      </strong>{" "}
                      Sometimes a number can only go in one cell within a row,
                      column, or box, even if that cell has other candidates.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 dark:text-yellow-400 font-bold mt-0.5">
                      •
                    </span>
                    <span>
                      <strong className="text-black dark:text-white">
                        Work systematically:
                      </strong>{" "}
                      Focus on one section at a time rather than jumping
                      around randomly. This helps you spot patterns more
                      easily.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 dark:text-yellow-400 font-bold mt-0.5">
                      •
                    </span>
                    <span>
                      <strong className="text-black dark:text-white">
                        Use the help menu:
                      </strong>{" "}
                      Don&apos;t hesitate to use &quot;Check Cell&quot; or
                      &quot;Check Puzzle&quot; if you&apos;re stuck. Learning
                      from mistakes is part of the process!
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Difficulty Levels */}
          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-2">
                <ArrowUp className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Difficulty Levels
              </h3>
            </div>
            <div className="grid gap-2 ml-11 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p>
                  <strong className="text-black dark:text-white">
                    Easy:
                  </strong>{" "}
                  Perfect for beginners. Fewer empty cells and straightforward
                  logic.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <p>
                  <strong className="text-black dark:text-white">
                    Medium:
                  </strong>{" "}
                  Requires some strategy and candidate tracking.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p>
                  <strong className="text-black dark:text-white">
                    Hard:
                  </strong>{" "}
                  Challenging puzzles that need advanced techniques and
                  patience.
                </p>
              </div>
            </div>
          </section>
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

