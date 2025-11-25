"use client";

import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Direction } from "../types";

interface GameControlsProps {
  onMove: (direction: Direction) => void;
}

export default function GameControls({ onMove }: GameControlsProps) {
  return (
    <div className="mt-6 flex flex-col items-center gap-2 sm:hidden">
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
        Mobile Controls
      </p>
      <div className="grid grid-cols-3 gap-2">
        {/* Top row - Up button */}
        <div className="col-start-2">
          <Button
            onClick={() => onMove("up")}
            variant="outline"
            size="icon"
            className="h-14 w-14"
          >
            <ArrowUp className="h-6 w-6" />
          </Button>
        </div>

        {/* Middle row - Left and Right buttons */}
        <Button
          onClick={() => onMove("left")}
          variant="outline"
          size="icon"
          className="h-14 w-14"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div /> {/* Empty space */}
        <Button
          onClick={() => onMove("right")}
          variant="outline"
          size="icon"
          className="h-14 w-14"
        >
          <ArrowRight className="h-6 w-6" />
        </Button>

        {/* Bottom row - Down button */}
        <div className="col-start-2">
          <Button
            onClick={() => onMove("down")}
            variant="outline"
            size="icon"
            className="h-14 w-14"
          >
            <ArrowDown className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
