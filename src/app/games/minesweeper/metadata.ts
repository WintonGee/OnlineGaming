import { createGameMetadataAndStructuredData } from "@/lib/metadata";
import { minesweeperConfig } from "./config";

export const gameOptions = {
  title: `Play ${minesweeperConfig.name} Free Online - No Ads | Classic Game`,
  description: `${minesweeperConfig.longDescription}. Choose from Easy, Medium, Hard difficulty or create custom boards. Track your best times. No downloads required.`,
  keywords: minesweeperConfig.seoKeywords,
  gamePath: minesweeperConfig.href,
  ogImage: minesweeperConfig.ogImage,
  structuredData: {
    name: `${minesweeperConfig.name} - Free Online Classic Game`,
    alternateName: "Mine Sweeper",
    description: `${minesweeperConfig.longDescription}. Choose from Easy, Medium, Hard difficulty or create custom boards. Track your best times.`,
    genre: ["Puzzle", "Logic", "Strategy"],
    featureList: [
      "Classic Windows-style Minesweeper",
      "Multiple difficulty levels (Easy, Medium, Hard)",
      "Custom board settings",
      "Best time tracking",
      "Classic graphics and animations",
      "Responsive design for all devices",
      "Dark mode support",
      "No ads",
      "No registration required",
    ],
    ratingValue: "4.6",
    ratingCount: "750",
  },
};

export const { metadata, structuredData } =
  createGameMetadataAndStructuredData(gameOptions);
