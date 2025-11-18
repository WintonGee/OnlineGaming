"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  ClipboardCheck,
  Eye,
  Grid,
  RotateCcw,
  Wand2,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SudokuHintMenuProps {
  disabled?: boolean;
  disableRevealCell?: boolean;
  disablePuzzleWideActions?: boolean;
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
  onCheckCell,
  onCheckPuzzle,
  onRevealCell,
  onRevealPuzzle,
  onResetPuzzle,
}: SudokuHintMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (callback: () => void, shouldClose = true) => {
    if (disabled) return;
    callback();
    if (shouldClose) {
      setOpen(false);
    }
  };

  const menuItems = [
    {
      key: "check-cell",
      label: "Check Cell",
      onSelect: onCheckCell,
      disabled,
      icon: CheckCircle2,
    },
    {
      key: "check-puzzle",
      label: "Check Puzzle",
      onSelect: onCheckPuzzle,
      disabled,
      icon: ClipboardCheck,
    },
    {
      key: "reveal-cell",
      label: "Reveal Cell",
      onSelect: onRevealCell,
      disabled: disabled || disableRevealCell,
      icon: Eye,
    },
    {
      key: "reveal-puzzle",
      label: "Reveal Puzzle",
      onSelect: onRevealPuzzle,
      disabled: disabled || disablePuzzleWideActions,
      icon: Grid,
    },
    {
      key: "reset-puzzle",
      label: "Reset Puzzle",
      onSelect: onResetPuzzle,
      disabled: disabled || disablePuzzleWideActions,
      icon: RotateCcw,
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex items-center gap-2 rounded-2xl border border-gray-200 bg-white/80 px-4 py-2 text-sm font-semibold text-black shadow-sm transition-colors dark:border-gray-700 dark:bg-black/40 dark:text-white",
          disabled
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        )}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Hint actions"
      >
        <Wand2 className="h-4 w-4" />
        Hints
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            open ? "rotate-180" : "rotate-0"
          )}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 z-50 mt-2 w-48 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-900"
        >
          {menuItems.map(({ key, label, onSelect, disabled: itemDisabled, icon: Icon }) => (
            <button
              key={key}
              type="button"
              role="menuitem"
              disabled={itemDisabled}
              onClick={() => handleSelect(onSelect)}
              className={cn(
                "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-black transition-colors dark:text-white",
                itemDisabled
                  ? "cursor-not-allowed opacity-40"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

