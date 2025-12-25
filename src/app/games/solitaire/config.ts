import { Spade } from "lucide-react";
import { GameConfig } from "@/lib/types";

export const solitaireConfig: GameConfig = {
  name: "Solitaire",
  slug: "solitaire",
  href: "/games/solitaire",
  description: "Classic Klondike solitaire - stack cards to win",
  longDescription:
    "Play the classic Klondike Solitaire card game online for free. Build foundation piles from Ace to King while arranging tableau columns in alternating colors. Features draw-1 and draw-3 modes, move counter, and auto-complete.",
  genre: "Card Game",
  icon: Spade,
  ogImage: "/og-solitaire.png",
  seoKeywords: [
    "solitaire",
    "solitaire online",
    "klondike solitaire",
    "play solitaire",
    "free solitaire",
    "solitaire no ads",
    "classic solitaire",
    "card games",
    "patience card game",
    "solitaire game",
    "online solitaire free",
    "klondike card game",
  ],
};
