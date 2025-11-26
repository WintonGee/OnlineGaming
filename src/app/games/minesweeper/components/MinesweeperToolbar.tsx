import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";
import { Difficulty } from "../types";

interface MinesweeperToolbarProps {
  selectedDifficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onNewGame: () => void;
  onCustomClick: () => void;
}

const STANDARD_DIFFICULTIES: Difficulty[] = ["Beginner", "Intermediate", "Expert"];
const ALL_DIFFICULTIES: Difficulty[] = [...STANDARD_DIFFICULTIES, "Custom"];

export default function MinesweeperToolbar({
  selectedDifficulty,
  onDifficultyChange,
  onNewGame,
  onCustomClick,
}: MinesweeperToolbarProps) {
  const handleDifficultySelect = (difficulty: Difficulty) => {
    if (difficulty === "Custom") {
      onCustomClick();
    } else {
      onDifficultyChange(difficulty);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
      {/* Mobile: Dropdown menu */}
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "rounded-full border px-6 py-2 text-sm font-semibold transition-colors flex items-center gap-2",
                "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
              )}
            >
              {selectedDifficulty}
              <ChevronDown className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-40">
            {ALL_DIFFICULTIES.map((level) => (
              <DropdownMenuItem
                key={level}
                onClick={() => handleDifficultySelect(level)}
                className="flex items-center justify-between cursor-pointer"
              >
                {level}
                {level === selectedDifficulty && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop: Button row */}
      <div className="hidden sm:flex items-center gap-2">
        {STANDARD_DIFFICULTIES.map((level) => (
          <button
            key={level}
            onClick={() => onDifficultyChange(level)}
            className={cn(
              "rounded-full border px-6 py-2 text-sm font-semibold transition-colors",
              level === selectedDifficulty
                ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
                : "bg-white text-black border-gray-300 hover:bg-gray-100 dark:bg-black dark:text-white dark:border-gray-700 dark:hover:bg-gray-800"
            )}
          >
            {level}
          </button>
        ))}
        <button
          onClick={onCustomClick}
          className={cn(
            "rounded-full border px-6 py-2 text-sm font-semibold transition-colors",
            selectedDifficulty === "Custom"
              ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
              : "bg-white text-black border-gray-300 hover:bg-gray-100 dark:bg-black dark:text-white dark:border-gray-700 dark:hover:bg-gray-800"
          )}
        >
          Custom
        </button>
      </div>

      <Button
        onClick={onNewGame}
        className="rounded-full px-6 py-2 text-sm font-semibold uppercase tracking-wide ml-2 lg:ml-4 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white border-2 border-gray-400 dark:border-gray-500 hover:border-gray-600 dark:hover:border-gray-400 transition-all"
      >
        New Game
      </Button>
    </div>
  );
}

