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
import GameHelpMenu from "./GameHelpMenu";

interface MinesweeperToolbarProps {
  selectedDifficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onNewGame: () => void;
  onCustomClick: () => void;
  onHowToPlay: () => void;
  onRevealHint?: () => void;
  onFlagHint?: () => void;
}

const STANDARD_DIFFICULTIES: Difficulty[] = ["Beginner", "Intermediate", "Expert"];
const ALL_DIFFICULTIES: Difficulty[] = [...STANDARD_DIFFICULTIES, "Custom"];

export default function MinesweeperToolbar({
  selectedDifficulty,
  onDifficultyChange,
  onNewGame,
  onCustomClick,
  onHowToPlay,
  onRevealHint,
  onFlagHint,
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
      {/* Difficulty and New Game Group */}
      <div className="flex items-center gap-2">
        {/* Difficulty Dropdown - All screen sizes */}
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
          <DropdownMenuContent align="start" className="w-40">
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

        {/* New Game Button */}
        <Button
          onClick={onNewGame}
          className="rounded-full px-6 py-2 text-sm font-semibold uppercase tracking-wide bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white border-2 border-gray-400 dark:border-gray-500 hover:border-gray-600 dark:hover:border-gray-400 transition-all"
        >
          New Game
        </Button>
      </div>

      {/* Help Menu */}
      <div className="ml-4 sm:ml-6">
        <GameHelpMenu
          onHowToPlay={onHowToPlay}
          onNewGame={onNewGame}
          onRevealHint={onRevealHint}
          onFlagHint={onFlagHint}
          variant="rounded"
        />
      </div>
    </div>
  );
}

