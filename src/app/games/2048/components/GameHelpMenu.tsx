"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw, Wand2, ChevronDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameHelpMenuProps {
  onHowToPlay: () => void;
  onNewGame: () => void;
}

export default function GameHelpMenu({
  onHowToPlay,
  onNewGame,
}: GameHelpMenuProps) {
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

  const handleSelect = (callback: () => void) => {
    callback();
    setOpen(false);
  };

  const menuItems = [
    {
      key: "how-to-play",
      label: "How to Play",
      onSelect: onHowToPlay,
      icon: Info,
      separator: true,
    },
    {
      key: "new-game",
      label: "New Game",
      onSelect: onNewGame,
      icon: RotateCcw,
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex items-center gap-1.5 sm:gap-2 rounded-2xl border border-gray-200 bg-white/80 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-black shadow-sm transition-colors dark:border-gray-700 dark:bg-black/40 dark:text-white",
          "hover:bg-gray-100 dark:hover:bg-gray-800"
        )}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Help menu"
      >
        <Wand2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
        <span className="whitespace-nowrap">Help</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform flex-shrink-0",
            open ? "rotate-180" : "rotate-0"
          )}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 z-50 mt-2 w-48 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-900"
        >
          {menuItems.map(
            ({ key, label, onSelect, icon: Icon, separator }) => (
              <div key={key}>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleSelect(onSelect)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-black transition-colors dark:text-white",
                    "hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
                {separator && (
                  <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

