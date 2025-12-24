import { createGameMetadataAndStructuredData } from "@/lib/metadata";
import { game2048Config } from "./config";

export const gameOptions = {
  title: `Play ${game2048Config.name} Game Free Online - No Ads | Classic Tile Puzzle`,
  description: `${game2048Config.longDescription}. Slide tiles to combine numbers and reach 2048. Smooth animations, responsive design. No downloads required.`,
  keywords: game2048Config.seoKeywords,
  gamePath: game2048Config.href,
  ogImage: game2048Config.ogImage,
  structuredData: {
    name: `${game2048Config.name} - Free Online Tile ${game2048Config.genre} Game`,
    alternateName: `${game2048Config.name} Game`,
    description: `${game2048Config.longDescription}. Combine tiles with the same number to reach 2048. Addictive gameplay with smooth animations and responsive design.`,
    genre: ["Puzzle", "Tile Matching", "Strategy"],
    featureList: [
      "Classic 2048 gameplay",
      "Smooth tile animations",
      "Score tracking and best score",
      "Responsive design for all devices",
      "Keyboard and swipe controls",
      "Dark mode support",
      "No ads",
      "No registration required",
    ],
    ratingValue: "4.7",
    ratingCount: "850",
  },
};

export const { metadata, structuredData } =
  createGameMetadataAndStructuredData(gameOptions);
