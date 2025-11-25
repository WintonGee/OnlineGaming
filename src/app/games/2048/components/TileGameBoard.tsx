"use client";

import { useRef } from "react";
import { Tile, Direction } from "../types";
import { GRID_SIZE } from "../constants";
import { cn } from "@/lib/utils";
import { useSwipeInput } from "../hooks/useSwipeInput";
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

/**
 * Individual tile component with animations
 */
function TileComponent({ tile, gap }: { tile: Tile; gap: number }) {
  const isMerged = tile.mergedFrom && tile.mergedFrom.length > 0;

  // Calculate tile size: (container width - total gaps) / 4
  // There are 3 gaps between 4 tiles
  const tileSize = `calc((100% - ${gap * 3}px) / 4)`;

  // Calculate position: (tile width + gap) * index
  const getCellPosition = (index: number) => {
    if (index === 0) return "0px";
    return `calc((100% - ${gap * 3}px) / 4 * ${index} + ${gap * index}px)`;
  };

  return (
    <div
      key={tile.id}
      className={cn(
        "absolute rounded-md flex items-center justify-center font-bold",
        "transition-all duration-100 ease-out",
        getTileTextColor(tile.value),
        getTileFontSize(tile.value),
        tile.isNew && "tile-new",
        isMerged && "tile-merged"
      )}
      style={{
        width: tileSize,
        height: tileSize,
        left: getCellPosition(tile.position.col),
        top: getCellPosition(tile.position.row),
        backgroundColor: getTileBackground(tile.value),
      }}
    >
      {tile.value}
    </div>
  );
}

export default function TileGameBoard({ tiles, onMove }: TileGameBoardProps) {
  // Use responsive sizes that match Tailwind's breakpoints
  const { gap, padding } = useResponsiveSizes();
  const boardRef = useRef<HTMLDivElement>(null);

  // Handle swipe input - only within the board area
  useSwipeInput({
    onMove,
    enabled: true,
    elementRef: boardRef,
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
