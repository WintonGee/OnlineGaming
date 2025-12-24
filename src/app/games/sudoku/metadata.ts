import { createGameMetadataAndStructuredData } from "@/lib/metadata";
import { sudokuConfig } from "./config";

export const gameOptions = {
  title: `Play ${sudokuConfig.name} Free Online - No Ads | Multiple Difficulty Levels`,
  description: `${sudokuConfig.longDescription}. Features auto-candidates, hints, undo, and more. No registration or download required.`,
  keywords: sudokuConfig.seoKeywords,
  gamePath: sudokuConfig.href,
  ogImage: sudokuConfig.ogImage,
  structuredData: {
    name: `${sudokuConfig.name} - Free Online ${sudokuConfig.genre} Game`,
    alternateName: `${sudokuConfig.name} Puzzle`,
    description: `${sudokuConfig.longDescription}. Features auto-candidates, hints, undo functionality, and more.`,
    genre: ["Puzzle", "Logic", "Brain Teaser"],
    featureList: [
      "Multiple difficulty levels (Easy, Medium, Hard, Expert)",
      "Auto-candidate mode",
      "Hints and cell checking",
      "Undo functionality",
      "Responsive design",
      "Dark mode support",
      "No ads",
      "No registration required",
    ],
    ratingValue: "4.8",
    ratingCount: "1000",
  },
};

export const { metadata, structuredData } =
  createGameMetadataAndStructuredData(gameOptions);
