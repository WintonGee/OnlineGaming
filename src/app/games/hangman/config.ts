import { HelpCircle } from "lucide-react";
import { GameConfig } from "@/lib/types";

export const hangmanConfig: GameConfig = {
  name: "Hangman",
  slug: "hangman",
  href: "/games/hangman",
  description: "Guess letters to reveal the hidden word",
  longDescription: "Classic word guessing game with multiple categories",
  genre: "Word Game",
  icon: HelpCircle,
  ogImage: "/og-hangman.png",
  seoKeywords: [
    "hangman",
    "hangman game",
    "word game",
    "guessing game",
    "free hangman",
    "online hangman",
    "word puzzle",
    "letter game",
    "vocabulary game",
    "educational game",
  ],
};
