"use client";

import { useRef, memo } from "react";
import { GridSize, Direction } from "../types";
import { cn } from "@/lib/utils/cn";
import { useSwipeInput } from "@/lib/hooks/useSwipeInput";
import { SWIPE_THRESHOLD } from "../constants";

interface TileMetadata {
  value: number;
  index: number;
  position: { row: number; col: number };
  isMovable: boolean;
}

interface SlidingPuzzleBoardProps {
  tilesWithMetadata: TileMetadata[];
  gridSize: GridSize;
  won: boolean;
  onTileClick: (tileIndex: number) => void;
  onMove: (direction: Direction) => void;
}

interface TileComponentProps {
  value: number;
  index: number;
  position: { row: number; col: number };
  gridSize: GridSize;
  canMove: boolean;
  won: boolean;
  onClick: () => void;
}

/**
 * Get tile background color based on value and grid size
 */
function getTileBackground(value: number, gridSize: GridSize): string {
  if (value === 0) return "transparent";

  // Create a gradient of colors based on tile value
  const totalTiles = gridSize * gridSize - 1;
  const hue = (value / totalTiles) * 40 + 20; // Range from 20 (orange) to 60 (yellow)
  const saturation = 50 + (value / totalTiles) * 30; // Increase saturation
  const lightness = 55 - (value / totalTiles) * 15; // Darker for higher values

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Get text color based on tile value
 */
function getTileTextColor(value: number, gridSize: GridSize): string {
  const totalTiles = gridSize * gridSize - 1;
  // Use white text for darker tiles (higher values)
  return value > totalTiles / 2 ? "text-white" : "text-gray-800";
}

/**
 * Get font size based on grid size and value
 */
function getTileFontSize(gridSize: GridSize, value: number): string {
  if (gridSize === 3) {
    return "text-3xl sm:text-4xl";
  } else if (gridSize === 4) {
    return value >= 10 ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl";
  } else {
    return value >= 10 ? "text-base sm:text-lg" : "text-lg sm:text-xl";
  }
}

/**
 * Individual tile component with animations
 */
const TileComponent = memo(function TileComponent({
  value,
  index,
  position,
  gridSize,
  canMove,
  won,
  onClick,
}: TileComponentProps) {
  const isEmpty = value === 0;

  // Calculate position for CSS
  const size = 100 / gridSize;
  const left = `${position.col * size}%`;
  const top = `${position.row * size}%`;

  if (isEmpty) {
    return null; // Don't render the empty tile
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!canMove || won}
      className={cn(
        "absolute tile-position",
        "flex items-center justify-center font-bold rounded-lg",
        "select-none transition-shadow",
        getTileTextColor(value, gridSize),
        getTileFontSize(gridSize, value),
        canMove && !won && "cursor-pointer hover:brightness-110 hover:shadow-lg active:brightness-95",
        !canMove && "cursor-default",
        won && "cursor-default"
      )}
      style={{
        width: `calc(${size}% - 4px)`,
        height: `calc(${size}% - 4px)`,
        left: `calc(${left} + 2px)`,
        top: `calc(${top} + 2px)`,
        backgroundColor: getTileBackground(value, gridSize),
        willChange: "left, top",
      }}
    >
      {value}
    </button>
  );
});

export default function SlidingPuzzleBoard({
  tilesWithMetadata,
  gridSize,
  won,
  onTileClick,
  onMove,
}: SlidingPuzzleBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);

  // Handle swipe input
  useSwipeInput({
    onMove,
    enabled: !won,
    elementRef: boardRef,
    threshold: SWIPE_THRESHOLD,
  });

  // Get gap size based on grid size
  const gap = gridSize === 3 ? 8 : gridSize === 4 ? 6 : 4;

  return (
    <div className="mx-auto w-full max-w-md px-4 sm:px-0">
      {/* Grid container */}
      <div
        ref={boardRef}
        className="relative rounded-2xl bg-gray-300 dark:bg-gray-700 shadow-lg border border-gray-400 dark:border-gray-600 aspect-square"
        style={{
          padding: `${gap}px`,
          touchAction: "none",
        }}
      >
        {/* Background grid cells */}
        <div
          className={cn("grid pointer-events-none h-full")}
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gap: `${gap}px`,
          }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, index) => (
            <div
              key={index}
              className="rounded-lg bg-gray-200 dark:bg-gray-800"
            />
          ))}
        </div>

        {/* Tiles layer (absolutely positioned over grid) */}
        <div
          className="absolute"
          style={{
            inset: `${gap}px`,
          }}
        >
          {tilesWithMetadata.map((tile) => (
            <TileComponent
              key={tile.value === 0 ? "empty" : tile.value}
              value={tile.value}
              index={tile.index}
              position={tile.position}
              gridSize={gridSize}
              canMove={tile.isMovable}
              won={won}
              onClick={() => onTileClick(tile.index)}
            />
          ))}
        </div>

        {/* Win overlay */}
        {won && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 dark:bg-black/50 rounded-2xl">
            <div className="text-white text-2xl sm:text-3xl font-bold text-center px-4">
              Solved!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
