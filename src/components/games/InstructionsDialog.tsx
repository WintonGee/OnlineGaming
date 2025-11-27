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

interface InstructionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string | React.ReactNode;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  buttonText?: string;
  buttonClassName?: string;
  showFooter?: boolean;
}

export default function InstructionsDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  maxWidth = "lg",
  buttonText = "Got it!",
  buttonClassName,
  showFooter = true,
}: InstructionsDialogProps) {
  const maxWidthClass = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
    "3xl": "sm:max-w-3xl",
  }[maxWidth];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${maxWidthClass} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription className={description === "sr-only" ? "sr-only" : ""}>
            {description === "sr-only" 
              ? `Instructions for playing ${typeof title === "string" ? title.replace("How to Play ", "") : "the game"}`
              : description || (typeof title === "string" ? `Instructions for playing ${title.replace("How to Play ", "")}` : "Instructions for playing the game")
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
          {children}
        </div>

        {showFooter && (
          <DialogFooter className={buttonClassName ? "border-t border-gray-200 dark:border-gray-800 pt-4" : "mt-4"}>
            <Button
              onClick={() => onOpenChange(false)}
              className={buttonClassName || "w-full sm:w-auto"}
            >
              {buttonText}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

