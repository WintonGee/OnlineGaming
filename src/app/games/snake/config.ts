import { Gamepad2 } from "lucide-react";
import { GameConfig } from "@/lib/types";

export const snakeConfig: GameConfig = {
  name: "Snake",
  slug: "snake",
  href: "/games/snake",
  description: "Eat food and grow your snake",
  longDescription: "Classic Snake arcade game - eat food and grow longer",
  genre: "Arcade",
  icon: Gamepad2,
};
