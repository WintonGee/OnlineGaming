"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ClipboardCheck,
  Eye,
  Grid,
  RotateCcw,
  Wand2,
  ChevronDown,
  Info,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface SudokuHintMenuProps {
  disabled?: boolean;
  disableRevealCell?: boolean;
  disablePuzzleWideActions?: boolean;
  onHowToPlay: () => void;
  onCheckCell: () => void;
  onCheckPuzzle: () => void;
  onRevealCell: () => void;
  onRevealPuzzle: () => void;
  onResetPuzzle: () => void;
}

export default function SudokuHintMenu({
  disabled = false,
  disableRevealCell = false,
  disablePuzzleWideActions = false,
  onHowToPlay,
  onCheckCell,
  onCheckPuzzle,
  onRevealCell,
  onRevealPuzzle,
  onResetPuzzle,
}: SudokuHintMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex items-center gap-2 rounded-2xl border border-gray-200 bg-white/80 px-4 py-2 text-sm font-semibold text-black shadow-sm transition-colors dark:border-gray-700 dark:bg-black/40 dark:text-white",
            disabled
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-gray-100 dark:hover:bg-gray-800"
          )}
          aria-label="Help menu"
        >
          <Wand2 className="h-4 w-4" />
          Help
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              open ? "rotate-180" : "rotate-0"
            )}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-48 rounded-2xl p-2">
        <DropdownMenuItem
          onClick={onHowToPlay}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium cursor-pointer"
        >
          <Info className="h-4 w-4" />
          How to Play
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onCheckCell}
          disabled={disabled}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium cursor-pointer"
        >
          <CheckCircle2 className="h-4 w-4" />
          Check Cell
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onCheckPuzzle}
          disabled={disabled}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium cursor-pointer"
        >
          <ClipboardCheck className="h-4 w-4" />
          Check Puzzle
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onRevealCell}
          disabled={disabled || disableRevealCell}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium cursor-pointer"
        >
          <Eye className="h-4 w-4" />
          Reveal Cell
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onRevealPuzzle}
          disabled={disabled || disablePuzzleWideActions}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium cursor-pointer"
        >
          <Grid className="h-4 w-4" />
          Reveal Puzzle
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onResetPuzzle}
          disabled={disabled || disablePuzzleWideActions}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Puzzle
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

