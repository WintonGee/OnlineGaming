import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bomb } from 'lucide-react';

interface GameOverDialogProps {
  open: boolean;
  onNewGame: () => void;
}

export default function GameOverDialog({ open, onNewGame }: GameOverDialogProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <Bomb className="h-12 w-12 sm:h-16 sm:w-16 text-red-500" />
          </div>
          <DialogTitle className="text-center text-2xl">Game Over!</DialogTitle>
          <DialogDescription className="text-center">
            You hit a mine! Better luck next time.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={onNewGame} className="w-full">
            Try Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
