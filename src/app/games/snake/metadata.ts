import { createGameMetadataAndStructuredData } from "@/lib/metadata";
import { snakeConfig } from "./config";

export const gameOptions = {
  title: `Play ${snakeConfig.name} Game Free Online - No Ads | Classic ${snakeConfig.genre}`,
  description: `${snakeConfig.longDescription}. Multiple difficulty levels, responsive controls, and dark mode. No downloads required.`,
  keywords: snakeConfig.seoKeywords,
  gamePath: snakeConfig.href,
  ogImage: snakeConfig.ogImage,
  structuredData: {
    name: `${snakeConfig.name} - Free Online Classic ${snakeConfig.genre} Game`,
    alternateName: `${snakeConfig.name} Game`,
    description: `${snakeConfig.longDescription}. Multiple difficulty levels with responsive keyboard and swipe controls.`,
    genre: ["Arcade", "Action", "Classic"],
    featureList: [
      "Classic Snake gameplay",
      "Multiple difficulty levels",
      "Keyboard and swipe controls",
      "Score tracking and high scores",
      "Responsive design for all devices",
      "Dark mode support",
      "No ads",
      "No registration required",
    ],
    ratingValue: "4.6",
    ratingCount: "720",
  },
};

export const { metadata, structuredData } =
  createGameMetadataAndStructuredData(gameOptions);
