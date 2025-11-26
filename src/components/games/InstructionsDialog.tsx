"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface InstructionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  buttonText?: string;
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
              ? `Instructions for playing ${title.replace("How to Play ", "")}`
              : description || `Instructions for playing ${title.replace("How to Play ", "")}`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
          {children}
        </div>

        {showFooter && (
          <div className="flex justify-end mt-4">
            <Button onClick={() => onOpenChange(false)}>{buttonText}</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

