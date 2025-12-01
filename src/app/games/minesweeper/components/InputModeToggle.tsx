import { Button } from "@/components/ui/button";
import { Flag, MousePointer2 } from "lucide-react";
import { InputMode } from "../types";
import { cn } from "@/lib/utils/cn";

interface InputModeToggleProps {
  mode: InputMode;
  onToggle: () => void;
  hasMouse: boolean;
}

export default function InputModeToggle({
  mode,
  onToggle,
  hasMouse,
}: InputModeToggleProps) {
  // Hide on desktop (when mouse is detected)
  if (hasMouse) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-10">
      <Button
        onClick={onToggle}
        size="lg"
        className={cn(
          "shadow-lg h-14 w-14 sm:h-16 sm:w-16 rounded-full",
          mode === "flag"
            ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            : "bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700"
        )}
        title={
          mode === "reveal"
            ? "Reveal mode - tap to switch to Flag mode"
            : "Flag mode - tap to switch to Reveal mode"
        }
      >
        {mode === "reveal" ? (
          <MousePointer2 className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
        ) : (
          <Flag className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
        )}
      </Button>
    </div>
  );
}
