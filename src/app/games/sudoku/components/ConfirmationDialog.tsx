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
import { ConfirmationType } from "../types";

interface ConfirmationConfig {
  title: string;
  description: string;
  actionLabel: string;
  actionClassName?: string;
}

const CONFIRMATION_CONFIGS: Record<ConfirmationType, ConfirmationConfig> = {
  reveal: {
    title: "Reveal the entire puzzle?",
    description:
      "This will fill in every cell with the solution. You can still undo, but your current progress will be overwritten.",
    actionLabel: "Reveal Puzzle",
    actionClassName: "bg-orange-600 hover:bg-orange-700",
  },
  reset: {
    title: "Reset this puzzle?",
    description:
      "This clears all of your entries and notes so you can start over from the original puzzle.",
    actionLabel: "Reset Puzzle",
  },
};

interface ConfirmationDialogProps {
  open: boolean;
  type: ConfirmationType | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationDialog({
  open,
  type,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  if (!type) return null;

  const config = CONFIRMATION_CONFIGS[type];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-black border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-black dark:text-white">
            {config.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-300">
            {config.description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm} className={config.actionClassName}>
            {config.actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

