"use client";

import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Direction } from "../types";

interface GameControlsProps {
  onMove: (direction: Direction) => void;
}

export default function GameControls({ onMove }: GameControlsProps) {
  return (
    <div className="mt-6 flex items-center justify-center gap-2 sm:hidden">
      <Button
        onClick={() => onMove("up")}
        variant="outline"
        size="icon"
        className="h-14 w-14"
      >
        <ArrowUp className="h-6 w-6" />
      </Button>
      <Button
        onClick={() => onMove("down")}
        variant="outline"
        size="icon"
        className="h-14 w-14"
      >
        <ArrowDown className="h-6 w-6" />
      </Button>
      <Button
        onClick={() => onMove("left")}
        variant="outline"
        size="icon"
        className="h-14 w-14"
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <Button
        onClick={() => onMove("right")}
        variant="outline"
        size="icon"
        className="h-14 w-14"
      >
        <ArrowRight className="h-6 w-6" />
      </Button>
    </div>
  );
}
