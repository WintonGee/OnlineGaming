import { createGameMetadataAndStructuredData } from "@/lib/metadata";
import { connectFourConfig } from "./config";

export const gameOptions = {
  title: `Play ${connectFourConfig.name} Free Online - No Ads | Classic ${connectFourConfig.genre} Game`,
  description: `${connectFourConfig.longDescription}. Challenge the computer with Easy, Medium, and Hard AI modes, or play with a friend. Drop discs and get four in a row to win!`,
  keywords: connectFourConfig.seoKeywords,
  gamePath: connectFourConfig.href,
  ogImage: connectFourConfig.ogImage,
  structuredData: {
    name: `${connectFourConfig.name} - Free Online ${connectFourConfig.genre} Game`,
    alternateName: "Four in a Row",
    description: `${connectFourConfig.longDescription}. Play against AI with three difficulty levels or challenge a friend in two-player mode.`,
    genre: ["Strategy", "Board Game", "Puzzle"],
    featureList: [
      "Single player vs AI",
      "Three difficulty levels (Easy, Medium, Hard)",
      "Hard mode with advanced AI strategy",
      "Two player local multiplayer",
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

export const { metadata, structuredData } =
  createGameMetadataAndStructuredData(gameOptions);
