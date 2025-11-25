"use client";

import { RotateCcw, Wand2, Info } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface GameHelpMenuProps {
  onHowToPlay: () => void;
  onNewGame: () => void;
}

export default function GameHelpMenu({
  onHowToPlay,
  onNewGame,
}: GameHelpMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-1.5 sm:gap-2 rounded-2xl border border-gray-200 bg-white/80 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-black shadow-sm transition-colors dark:border-gray-700 dark:bg-black/40 dark:text-white",
            "hover:bg-gray-100 dark:hover:bg-gray-800"
          )}
          aria-label="Help menu"
        >
          <Wand2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="whitespace-nowrap">Help</span>
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
          onClick={onNewGame}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          New Game
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
