import { createGameMetadataAndStructuredData } from "@/lib/metadata";
import { blackjackConfig } from "./config";

export const gameOptions = {
  title: `Play ${blackjackConfig.name} Free Online - No Ads | Beat the Dealer`,
  description: `${blackjackConfig.longDescription}. Try to beat the dealer by getting as close to 21 as possible without going over. Simple Hit or Stand gameplay.`,
  keywords: blackjackConfig.seoKeywords,
  gamePath: blackjackConfig.href,
  ogImage: blackjackConfig.ogImage,
  structuredData: {
    name: `${blackjackConfig.name} - Free Online ${blackjackConfig.genre}`,
    alternateName: "21",
    description: `${blackjackConfig.longDescription}. Simple Hit or Stand gameplay.`,
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
