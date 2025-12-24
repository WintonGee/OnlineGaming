import { Spade } from "lucide-react";
import { GameConfig } from "@/lib/types";

export const blackjackConfig: GameConfig = {
  name: "Blackjack",
  slug: "blackjack",
  href: "/games/blackjack",
  description: "Beat the dealer without going over 21",
  longDescription: "Classic Blackjack card game - beat the dealer without going over 21",
  genre: "Card Game",
  icon: Spade,
  ogImage: "/og-blackjack.png",
  seoKeywords: [
    "blackjack",
    "blackjack game",
    "21 card game",
    "play blackjack",
    "blackjack online",
    "free blackjack",
    "blackjack no ads",
    "card games",
    "beat the dealer",
  ],
};
