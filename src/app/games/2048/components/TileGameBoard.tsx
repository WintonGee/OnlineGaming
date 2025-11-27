"use client";

import { useRef, memo } from "react";
import { Tile, Direction } from "../types";
import { GRID_SIZE } from "../constants";
import { cn } from "@/lib/shared/utils/cn";
import { useSwipeInput } from "@/lib/games/hooks/useSwipeInput";
import { SWIPE_THRESHOLD } from "../constants";
import { useResponsiveSizes } from "../hooks/useResponsiveSizes";
import {
  getTileTextColor,
  getTileBackground,
  getTileFontSize,
} from "../utils/tileStyles";

interface TileGameBoardProps {
  tiles: Tile[];
  onMove: (direction: Direction) => void;
}

interface TileComponentProps {
  tile: Tile;
  gap: number;
}

/**
 * Individual tile component with GPU-accelerated animations
 * Memoized to prevent unnecessary re-renders
 */
const TileComponent = memo(function TileComponent({
  tile,
  gap,
}: TileComponentProps) {
  const isMerged = tile.mergedFrom && tile.mergedFrom.length > 0;

  // Calculate tile size and position
  // Tile width = (100% - 3 gaps) / 4
  // Position = col/row * (tile width + gap)
  const gapTotal = gap * 3; // Total gap space between 4 tiles
  const tileSize = `calc((100% - ${gapTotal}px) / 4)`;

  // Position calculation: index * (25% of remaining space + gap offset)
  // This correctly positions each tile accounting for gaps
  const getPosition = (index: number) => {
    if (index === 0) return "0px";
    // Position = index * tile_width + index * gap
    // = index * ((100% - 3*gap) / 4) + index * gap
    // = index * ((100% - 3*gap) / 4 + gap)
    // = index * ((100% - 3*gap + 4*gap) / 4)
    // = index * ((100% + gap) / 4)
    return `calc(${index} * (100% + ${gap}px) / 4)`;
  };

  return (
    <div
      className={cn(
        "absolute rounded-md flex items-center justify-center font-bold",
        "tile-position", // Custom class for optimized transitions
        getTileTextColor(tile.value),
        getTileFontSize(tile.value),
        tile.isNew && "tile-new",
        isMerged && "tile-merged"
      )}
      style={{
        width: tileSize,
        height: tileSize,
        // Use left/top but with will-change for compositor optimization
        left: getPosition(tile.position.col),
        top: getPosition(tile.position.row),
        backgroundColor: getTileBackground(tile.value),
        // Hint to browser to promote to compositor layer
        willChange: "left, top",
      }}
    >
      {tile.value}
    </div>
  );
});

export default function TileGameBoard({ tiles, onMove }: TileGameBoardProps) {
  // Use responsive sizes that match Tailwind's breakpoints
  const { gap, padding } = useResponsiveSizes();
  const boardRef = useRef<HTMLDivElement>(null);

  // Handle swipe input - only within the board area
  useSwipeInput({
    onMove,
    enabled: true,
    elementRef: boardRef,
    threshold: SWIPE_THRESHOLD,
  });

  return (
    <div className="mx-auto max-w-md w-full px-4 sm:px-0">
      {/* Grid container with shadow and border like Sudoku */}
      <div
        ref={boardRef}
        className="relative rounded-2xl bg-[#bbada0] dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
        style={{
          padding: `${padding}px`,
          touchAction: "none", // Prevent default touch behaviors (scrolling, zooming)
        }}
      >
        {/* Background grid cells */}
        <div
          className="grid grid-cols-4 pointer-events-none"
          style={{ gap: `${gap}px` }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => (
            <div
              key={index}
              className="aspect-square rounded-md bg-[#cdc1b4] dark:bg-gray-700"
            />
          ))}
        </div>

        {/* Tiles layer (absolutely positioned over grid) */}
        <div className="absolute" style={{ inset: `${padding}px` }}>
          {tiles.map((tile) => (
            <TileComponent key={tile.id} tile={tile} gap={gap} />
          ))}
        </div>
      </div>
    </div>
  );
}
