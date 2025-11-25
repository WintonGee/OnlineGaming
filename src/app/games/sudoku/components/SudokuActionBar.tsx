import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import SudokuHintMenu from "./SudokuHintMenu";

interface SudokuActionBarProps {
  isMenuDisabled: boolean;
  canRevealCell: boolean;
  disablePuzzleWideActions: boolean;
  autoCandidateMode: boolean;
  onAutoCandidateModeChange: (checked: boolean) => void;
  onHowToPlay: () => void;
  onCheckCell: () => void;
  onCheckPuzzle: () => void;
  onRevealCell: () => void;
  onRevealPuzzle: () => void;
  onResetPuzzle: () => void;
}

export default function SudokuActionBar({
  isMenuDisabled,
  canRevealCell,
  disablePuzzleWideActions,
  autoCandidateMode,
  onAutoCandidateModeChange,
  onHowToPlay,
  onCheckCell,
  onCheckPuzzle,
  onRevealCell,
  onRevealPuzzle,
  onResetPuzzle,
}: SudokuActionBarProps) {
  return (
    <div className="flex items-center gap-3">
      <SudokuHintMenu
        disabled={isMenuDisabled}
        disableRevealCell={!canRevealCell}
        disablePuzzleWideActions={disablePuzzleWideActions}
        onHowToPlay={onHowToPlay}
        onCheckCell={onCheckCell}
        onCheckPuzzle={onCheckPuzzle}
        onRevealCell={onRevealCell}
        onRevealPuzzle={onRevealPuzzle}
        onResetPuzzle={onResetPuzzle}
      />
      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-black/40 px-4 py-2">
        <Checkbox
          id="auto-candidate-toolbar"
          checked={autoCandidateMode}
          onCheckedChange={(checked) => onAutoCandidateModeChange(checked === true)}
        />
        <Label
          htmlFor="auto-candidate-toolbar"
          className="text-sm font-medium text-black dark:text-white cursor-pointer"
        >
          Auto Candidate Mode
        </Label>
      </div>
    </div>
  );
}
