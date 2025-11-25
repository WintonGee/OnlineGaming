import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';
import { formatTime } from '../utils/styleUtils';
import { Difficulty, BestTimes } from '../types';

interface WinDialogProps {
  open: boolean;
  time: number;
  difficulty: Difficulty;
  bestTimes: BestTimes;
  onNewGame: () => void;
}

export default function WinDialog({ open, time, difficulty, bestTimes, onNewGame }: WinDialogProps) {
  const currentBest = bestTimes[difficulty];
  const isNewRecord = !currentBest || time < currentBest;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <Trophy className="h-12 w-12 sm:h-16 sm:w-16 text-yellow-500" />
          </div>
          <DialogTitle className="text-center text-2xl">You Win!</DialogTitle>
          <DialogDescription className="text-center">
            Congratulations! You completed {difficulty} difficulty.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Your Time</div>
            <div className="text-3xl font-bold font-mono">{formatTime(time)}</div>
          </div>

          {isNewRecord && currentBest && (
            <div className="text-center text-green-600 dark:text-green-400 font-semibold">
              🎉 New Best Time!
            </div>
          )}

          {!isNewRecord && currentBest && (
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Best Time</div>
              <div className="text-xl font-bold font-mono">{formatTime(currentBest)}</div>
            </div>
          )}

          {isNewRecord && !currentBest && (
            <div className="text-center text-green-600 dark:text-green-400 font-semibold">
              🎉 First Completion!
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onNewGame} className="w-full">
            New Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
