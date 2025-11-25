import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trophy } from "lucide-react";

interface WinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function WinDialog({ open, onOpenChange }: WinDialogProps) {
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
            Congratulations!
          </DialogTitle>
          <DialogDescription className="text-center text-base text-gray-700 dark:text-gray-300">
            You solved the puzzle correctly!
            <br />
            <br />
            Click &quot;New Game&quot; to try another puzzle.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
