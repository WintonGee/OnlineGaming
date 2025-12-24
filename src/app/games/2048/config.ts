import { Grid2x2 } from "lucide-react";
import { GameConfig } from "@/lib/types";

export const game2048Config: GameConfig = {
  name: "2048",
  slug: "2048",
  href: "/games/2048",
  description: "Combine tiles to reach 2048",
  longDescription: "Classic 2048 tile sliding puzzle game",
  genre: "Puzzle",
  icon: Grid2x2,
};
