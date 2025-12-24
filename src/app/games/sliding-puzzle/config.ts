import { LayoutGrid } from "lucide-react";
import { GameConfig } from "@/lib/types";

export const slidingPuzzleConfig: GameConfig = {
  name: "Sliding Puzzle",
  slug: "sliding-puzzle",
  href: "/games/sliding-puzzle",
  description: "Arrange numbered tiles in order",
  longDescription: "Classic 15 puzzle - arrange numbered tiles in order",
  genre: "Puzzle",
  icon: LayoutGrid,
};
