import { ArrowUpDown } from "lucide-react";
import { GameConfig } from "@/lib/types";

export const higherOrLowerConfig: GameConfig = {
  name: "Higher or Lower",
  slug: "higher-or-lower",
  href: "/games/higher-or-lower",
  description: "Guess if the next card is higher or lower",
  longDescription: "Test your luck and intuition in this classic card game. Guess whether the next card will be higher or lower than the current one to build your streak.",
  genre: "Card Game",
  icon: ArrowUpDown,
  ogImage: "/og-higher-or-lower.png",
  seoKeywords: [
    "higher or lower",
    "higher or lower game",
    "card guessing game",
    "play higher or lower",
    "higher lower online",
    "free card game",
    "guess the card",
    "card game no ads",
  ],
};
