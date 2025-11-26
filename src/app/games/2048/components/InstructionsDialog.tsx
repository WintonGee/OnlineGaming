"use client";

import InstructionsDialogBase from "@/components/games/InstructionsDialog";

interface InstructionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InstructionsDialog({
  open,
  onOpenChange,
}: InstructionsDialogProps) {
  return (
    <InstructionsDialogBase
      open={open}
      onOpenChange={onOpenChange}
      title="How to Play 2048"
      description="sr-only"
    >
      <div>
        <h3 className="font-semibold text-base mb-2 text-gray-900 dark:text-gray-100">
          Objective
        </h3>
        <p>
          Combine tiles with the same numbers to reach the{" "}
          <span className="font-bold text-yellow-600 dark:text-yellow-400">
            2048
          </span>{" "}
          tile!
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-base mb-2 text-gray-900 dark:text-gray-100">
          How to Move
        </h3>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>
            <span className="font-semibold">Desktop:</span> Use arrow keys
            (↑ ↓ ← →)
          </li>
          <li>
            <span className="font-semibold">Mobile:</span> Swipe in any
            direction or use the on-screen buttons
          </li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-base mb-2 text-gray-900 dark:text-gray-100">
          Game Rules
        </h3>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>
            Tiles slide as far as possible in the chosen direction until
            stopped by another tile or the edge
          </li>
          <li>
            When two tiles with the same number touch, they merge into one
            with their sum (2 + 2 = 4, 4 + 4 = 8, etc.)
          </li>
          <li>
            A tile can only merge once per move
          </li>
          <li>
            After each move, a new tile (2 or 4) appears in a random empty
            spot
          </li>
          <li>
            The game ends when there are no empty spaces and no possible
            merges
          </li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-base mb-2 text-gray-900 dark:text-gray-100">
          Tips
        </h3>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Keep your highest tile in a corner</li>
          <li>Build tiles in a snake-like pattern</li>
          <li>Don't chase small merges - focus on building big tiles</li>
          <li>Plan ahead to avoid filling up the board too quickly</li>
        </ul>
      </div>
    </InstructionsDialogBase>
  );
}
