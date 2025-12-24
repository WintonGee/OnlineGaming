import { Bomb } from "lucide-react";
import { GameConfig } from "@/lib/types";

export const minesweeperConfig: GameConfig = {
  name: "Minesweeper",
  slug: "minesweeper",
  href: "/games/minesweeper",
  description: "Clear the board without hitting mines",
  longDescription: "Classic Minesweeper game with customizable difficulty",
  genre: "Puzzle",
  icon: Bomb,
};
