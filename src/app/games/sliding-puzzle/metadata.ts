import { createGameMetadataAndStructuredData } from "@/lib/metadata";
import { slidingPuzzleConfig } from "./config";

export const gameOptions = {
  title: `Play ${slidingPuzzleConfig.name} Free Online - No Ads | 15 ${slidingPuzzleConfig.genre} Game`,
  description: `${slidingPuzzleConfig.longDescription}. Choose from 3x3, 4x4, or 5x5 grids. Track your best times and moves. No downloads required.`,
  keywords: slidingPuzzleConfig.seoKeywords,
  gamePath: slidingPuzzleConfig.href,
  ogImage: slidingPuzzleConfig.ogImage,
  structuredData: {
    name: `${slidingPuzzleConfig.name} - Free Online 15 ${slidingPuzzleConfig.genre} Game`,
    alternateName: "15 Puzzle",
    description: `${slidingPuzzleConfig.longDescription}. Multiple grid sizes - 3x3 Easy, 4x4 Medium (classic 15-puzzle), and 5x5 Hard. Slide tiles into the empty space.`,
    genre: ["Puzzle", "Logic", "Brain Teaser"],
    featureList: [
      "Classic 15-puzzle gameplay",
      "Multiple difficulty levels (3x3, 4x4, 5x5)",
      "Best time and move tracking",
      "Keyboard and touch controls",
      "Swipe gesture support",
      "Responsive design for all devices",
      "Dark mode support",
      "No ads",
      "No registration required",
    ],
    ratingValue: "4.5",
    ratingCount: "420",
  },
};

export const { metadata, structuredData } =
  createGameMetadataAndStructuredData(gameOptions);
