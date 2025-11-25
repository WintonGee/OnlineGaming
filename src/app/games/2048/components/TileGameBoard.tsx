"use client";

import { Tile } from "../types";
import { GRID_SIZE } from "../constants";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface TileGameBoardProps {
  tiles: Tile[];
}

/**
 * Gets the background color class for a tile based on its value
 * Colors match the classic 2048 game palette
 */
function getTileColor(value: number): string {
  const colorMap: Record<number, string> = {
    2: "text-[#776e65]",
    4: "text-[#776e65]",
    8: "text-white",
    16: "text-white",
    32: "text-white",
    64: "text-white",
    128: "text-white",
    256: "text-white",
    512: "text-white",
    1024: "text-white",
    2048: "text-white",
    4096: "text-white",
    8192: "text-white",
  };

  return colorMap[value] || "text-white";
}

/**
 * Gets the background color for a tile based on its value
 * Uses inline styles for exact color matching
 */
function getTileBackground(value: number): string {
  const colorMap: Record<number, string> = {
    2: "#eee4da",
    4: "#ede0c8",
    8: "#f2b179",
    16: "#f59563",
    32: "#f67c5f",
    64: "#f65e3b",
    128: "#edcf72",
    256: "#edcc61",
    512: "#edc850",
    1024: "#edc53f",
    2048: "#edc22e",
    4096: "#3c3a32",
    8192: "#3c3a32",
  };

  return colorMap[value] || "#3c3a32";
}

/**
 * Gets the font size class based on the number of digits
 */
function getFontSize(value: number): string {
  if (value >= 1000) return "text-xl sm:text-2xl md:text-3xl";
  if (value >= 100) return "text-2xl sm:text-3xl md:text-4xl";
  return "text-3xl sm:text-4xl md:text-5xl";
}

/**
 * Hook to get the current gap and padding based on screen width
 */
function useResponsiveSizes() {
  const [sizes, setSizes] = useState({ gap: 15, padding: 15 });

  useEffect(() => {
    const updateSizes = () => {
      const width = window.innerWidth;
      // Match Tailwind breakpoints: sm: 640px, md: 768px
      if (width >= 768) {
        setSizes({ gap: 15, padding: 15 }); // Consistent for classic 2048 look
      } else if (width >= 640) {
        setSizes({ gap: 12, padding: 12 });
      } else {
        setSizes({ gap: 10, padding: 10 });
      }
    };

    updateSizes();
    window.addEventListener("resize", updateSizes);
    return () => window.removeEventListener("resize", updateSizes);
  }, []);

  return sizes;
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
        "transition-all duration-300 ease-in-out",
        getTileColor(tile.value),
        getFontSize(tile.value),
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

export default function TileGameBoard({ tiles }: TileGameBoardProps) {
  // Use responsive sizes that match Tailwind's breakpoints
  const { gap, padding } = useResponsiveSizes();

  return (
    <div className="mx-auto max-w-md w-full px-4 sm:px-0">
      {/* Grid container with shadow and border like Sudoku */}
      <div
        className="relative rounded-2xl bg-[#bbada0] dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
        style={{ padding: `${padding}px` }}
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
