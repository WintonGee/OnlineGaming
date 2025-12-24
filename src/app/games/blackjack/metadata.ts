import { createGameMetadataAndStructuredData } from "@/lib/metadata";

export const gameOptions = {
  title: "Play Blackjack Free Online - No Ads | Beat the Dealer",
  description: "Play Blackjack free online without ads! Try to beat the dealer by getting as close to 21 as possible without going over. Simple Hit or Stand gameplay.",
  keywords: [
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
  gamePath: "/games/blackjack",
  ogImage: "/og-blackjack.png",
  structuredData: {
    name: "Blackjack - Free Online Card Game",
    alternateName: "21",
    description: "Classic Blackjack card game - beat the dealer without going over 21. Simple Hit or Stand gameplay.",
    genre: ["Card Game", "Strategy"],
    featureList: [
      "Single player vs dealer",
      "Hit and Stand options",
      "Classic blackjack rules",
      "Dealer stands on 17",
      "Clean, minimalist design",
      "Responsive for all devices",
      "Dark mode support",
      "No ads",
      "No registration required",
    ],
    ratingValue: "4.8",
    ratingCount: "1250",
  },
};

export const { metadata, structuredData } = createGameMetadataAndStructuredData(gameOptions);
