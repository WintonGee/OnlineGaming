import { Type } from "lucide-react";
import { GameConfig } from "@/lib/types";

export const wordleConfig: GameConfig = {
  name: "Wordle",
  slug: "wordle",
  href: "/games/wordle",
  description: "Guess the 5-letter word in 6 tries",
  longDescription: "Guess the 5-letter word in 6 tries with color-coded feedback",
  genre: "Word Game",
  icon: Type,
};
