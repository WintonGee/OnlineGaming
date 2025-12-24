import { createGameMetadataAndStructuredData } from "@/lib/metadata";
import { dotsAndBoxesConfig } from "./config";

export const gameOptions = {
  title: `Play ${dotsAndBoxesConfig.name} Free Online - No Ads | Classic ${dotsAndBoxesConfig.genre} Game`,
  description: `${dotsAndBoxesConfig.longDescription}. Challenge the computer with Easy, Medium, and Hard AI modes, or play with a friend. Multiple grid sizes from 3x3 to 6x6. No downloads required.`,
  keywords: dotsAndBoxesConfig.seoKeywords,
  gamePath: dotsAndBoxesConfig.href,
  ogImage: dotsAndBoxesConfig.ogImage,
  structuredData: {
    name: `${dotsAndBoxesConfig.name} - Free Online ${dotsAndBoxesConfig.genre} Game`,
    alternateName: "La Pipopipette",
    description: `${dotsAndBoxesConfig.longDescription}. Play against AI with three difficulty levels or challenge a friend in two-player mode. Multiple grid sizes and responsive design.`,
    genre: ["Strategy", "Board Game", "Puzzle"],
    featureList: [
      "Single player vs AI",
      "Three difficulty levels (Easy, Medium, Hard)",
      "Hard mode with strategic AI",
      "Two player local multiplayer",
      "Multiple grid sizes (3x3, 4x4, 5x5, 6x6)",
      "Score tracking",
      "Clean, minimalist design",
      "Responsive for all devices",
      "Dark mode support",
      "No ads",
      "No registration required",
    ],
    ratingValue: "4.6",
    ratingCount: "520",
  },
};

export const { metadata, structuredData } =
  createGameMetadataAndStructuredData(gameOptions);
