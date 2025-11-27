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
import { Trophy } from "lucide-react";

/**
 * Shared WinDialog component with flexible props for different game needs
 * 
 * @example
 * // Simple win dialog (Sudoku style)
 * <WinDialog open={won} onOpenChange={setWon} />
 * 
 * @example
 * // Win dialog with continue option (2048 style)
 * <WinDialog 
 *   open={won && !keepPlaying} 
 *   onOpenChange={handleClose}
 *   onContinue={continueAfterWin}
 *   onNewGame={startNewGame}
 *   message="Congratulations! You reached the 2048 tile!"
 * />
 * 
 * @example
 * // Win dialog with time stats (Minesweeper style)
 * <WinDialog
 *   open={showWinDialog}
 *   onOpenChange={setShowWinDialog}
 *   onNewGame={handleNewGame}
 *   time={time}
 *   difficulty={difficulty}
 *   bestTimes={bestTimes}
 * />
 */
interface BaseWinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message?: string;
}

interface WinDialogWithContinue extends BaseWinDialogProps {
  onContinue: () => void;
  onNewGame: () => void;
  message?: string;
}

interface WinDialogWithTime extends BaseWinDialogProps {
  onNewGame: () => void;
  time: number;
  difficulty: string;
  bestTimes: Record<string, number | undefined>;
  formatTime?: (seconds: number) => string;
}

interface WinDialogSimple extends BaseWinDialogProps {
  message?: string;
}

type WinDialogProps = WinDialogWithContinue | WinDialogWithTime | WinDialogSimple;

function isWinDialogWithContinue(props: WinDialogProps): props is WinDialogWithContinue {
  return 'onContinue' in props && 'onNewGame' in props;
}

function isWinDialogWithTime(props: WinDialogProps): props is WinDialogWithTime {
  return 'time' in props && 'difficulty' in props;
}

export default function WinDialog(props: WinDialogProps) {
  const { open, onOpenChange, title = "You Win!", message } = props;

  // Handle 2048-style dialog with continue option
  if (isWinDialogWithContinue(props)) {
    const handleOpenChange = (isOpen: boolean) => {
      if (!isOpen) {
        // When closing, default to continuing the game
        props.onContinue();
      }
      onOpenChange(isOpen);
    };

    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-full">
                <Trophy className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">{title}</DialogTitle>
            <DialogDescription className="text-center">
              {message || "Congratulations! You won!"}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button onClick={props.onContinue} variant="outline" className="w-full">
              Keep Playing
            </Button>
            <Button onClick={props.onNewGame} className="w-full">
              New Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Handle Minesweeper-style dialog with time stats
  if (isWinDialogWithTime(props)) {
    const { time, difficulty, bestTimes, formatTime } = props;
    const currentBest = bestTimes[difficulty];
    const isNewRecord = !currentBest || time < currentBest;
    const formatTimeFn = formatTime || ((seconds: number) => seconds.toString().padStart(3, '0'));

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <Trophy className="h-12 w-12 sm:h-16 sm:w-16 text-yellow-500" />
            </div>
            <DialogTitle className="text-center text-2xl">{title}</DialogTitle>
            <DialogDescription className="text-center">
              {message || `Congratulations! You completed ${difficulty} difficulty.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Your Time</div>
              <div className="text-3xl font-bold font-mono">{formatTimeFn(time)}</div>
            </div>

            {isNewRecord && currentBest && (
              <div className="text-center text-green-600 dark:text-green-400 font-semibold">
                🎉 New Best Time!
              </div>
            )}

            {!isNewRecord && currentBest && (
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Best Time</div>
                <div className="text-xl font-bold font-mono">{formatTimeFn(currentBest)}</div>
              </div>
            )}

            {isNewRecord && !currentBest && (
              <div className="text-center text-green-600 dark:text-green-400 font-semibold">
                🎉 First Completion!
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={props.onNewGame} className="w-full">
              New Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Handle simple win dialog (Sudoku style)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-black border-gray-300 dark:border-gray-700">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-black dark:bg-white rounded-full p-3">
              <Trophy className="h-12 w-12 text-white dark:text-black" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-serif text-black dark:text-white">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center text-base text-gray-700 dark:text-gray-300">
            {message || "You solved the puzzle correctly!"}
            <br />
            <br />
            Click &quot;New Game&quot; to try another puzzle.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

