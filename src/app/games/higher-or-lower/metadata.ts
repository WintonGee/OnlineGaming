import { createGameMetadataAndStructuredData } from "@/lib/metadata";
import { higherOrLowerConfig } from "./config";

export const gameOptions = {
  title: `Play ${higherOrLowerConfig.name} Free Online - No Ads | Card Game`,
  description: `${higherOrLowerConfig.longDescription}. Free to play with no ads. How long can your streak last?`,
  keywords: higherOrLowerConfig.seoKeywords,
  gamePath: higherOrLowerConfig.href,
  ogImage: higherOrLowerConfig.ogImage,
  structuredData: {
    name: `${higherOrLowerConfig.name} - Free Online ${higherOrLowerConfig.genre}`,
    alternateName: "Hi-Lo Card Game",
    description: `${higherOrLowerConfig.longDescription}. Simple and addictive gameplay.`,
    genre: ["Card Game", "Guessing Game", "Casual"],
    featureList: [
      "Classic higher or lower gameplay",
      "Track your best streak",
      "Clean, minimalist design",
      "Responsive for all devices",
      "Dark mode support",
      "No ads",
      "No registration required",
    ],
    ratingValue: "4.7",
    ratingCount: "980",
  },
};

export const { metadata, structuredData } = createGameMetadataAndStructuredData(gameOptions);
