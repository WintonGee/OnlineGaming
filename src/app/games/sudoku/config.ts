import { Grid3x3 } from "lucide-react";
import { GameConfig } from "@/lib/types";

export const sudokuConfig: GameConfig = {
  name: "Sudoku",
  slug: "sudoku",
  href: "/games/sudoku",
  description: "Fill the grid with numbers 1-9",
  longDescription: "Free online Sudoku puzzle game with multiple difficulty levels",
  genre: "Puzzle",
  icon: Grid3x3,
};
