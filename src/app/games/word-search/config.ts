import { Search } from "lucide-react";
import { GameConfig } from "@/lib/types";

export const wordSearchConfig: GameConfig = {
  name: "Word Search",
  slug: "word-search",
  href: "/games/word-search",
  description: "Find hidden words in a letter grid",
  longDescription: "Find hidden words in a grid of letters with multiple categories",
  genre: "Word Game",
  icon: Search,
};
