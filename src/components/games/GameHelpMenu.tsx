"use client";

import { useState } from "react";
import {
  RotateCcw,
  Wand2,
  Info,
  ChevronDown,
  Lightbulb,
  Flag,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/shared/utils/cn";

interface GameHelpMenuProps {
  onHowToPlay: () => void;
  onNewGame: () => void;
  onRevealHint?: () => void;
  onFlagHint?: () => void;
  variant?: "default" | "rounded";
}

export default function GameHelpMenu({
  onHowToPlay,
  onNewGame,
  onRevealHint,
  onFlagHint,
  variant = "default",
}: GameHelpMenuProps) {
  const [open, setOpen] = useState(false);

  const buttonClassName =
    variant === "rounded"
      ? cn(
          "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
          "bg-white text-black border-gray-300 hover:bg-gray-100 dark:bg-black dark:text-white dark:border-gray-700 dark:hover:bg-gray-800"
        )
      : cn(
          "flex items-center gap-2 rounded-2xl border border-gray-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-black shadow-sm transition-colors dark:border-gray-700 dark:bg-black/40 dark:text-white",
          "hover:bg-gray-100 dark:hover:bg-gray-800"
        );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={buttonClassName}
          aria-label="Help menu"
        >
          <Wand2
            className={cn("h-4 w-4", variant === "default" && "flex-shrink-0")}
          />
          <span className={variant === "default" ? "whitespace-nowrap" : ""}>
            Help
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              variant === "default" && "flex-shrink-0",
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

        {(onRevealHint || onFlagHint) && <DropdownMenuSeparator />}

        {onRevealHint && (
          <DropdownMenuItem
            onClick={() => {
              onRevealHint();
              setOpen(false);
            }}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium cursor-pointer"
          >
            <Lightbulb className="h-4 w-4" />
            Reveal a Number
          </DropdownMenuItem>
        )}

        {onFlagHint && (
          <DropdownMenuItem
            onClick={() => {
              onFlagHint();
              setOpen(false);
            }}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium cursor-pointer"
          >
            <Flag className="h-4 w-4" />
            Flag a Mine
          </DropdownMenuItem>
        )}

        {(onRevealHint || onFlagHint) && <DropdownMenuSeparator />}

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
