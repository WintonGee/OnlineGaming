import { Palette } from "lucide-react";
import { GameConfig } from "@/lib/types";

export const mastermindConfig: GameConfig = {
  name: "Mastermind",
  slug: "mastermind",
  href: "/games/mastermind",
  description: "Crack the secret color code",
  longDescription: "Classic code-breaking game - guess the secret color code",
  genre: "Puzzle",
  icon: Palette,
};
