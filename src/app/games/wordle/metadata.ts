import { createGameMetadataAndStructuredData } from "@/lib/metadata";
import { wordleConfig } from "./config";

export const gameOptions = {
  title: `Play ${wordleConfig.name} Game Free Online - No Ads | Word Puzzle Challenge`,
  description: `${wordleConfig.longDescription}. Features hard mode, statistics tracking, and unlimited plays. No downloads required.`,
  keywords: wordleConfig.seoKeywords,
  gamePath: wordleConfig.href,
  ogImage: wordleConfig.ogImage,
  structuredData: {
    name: `${wordleConfig.name} - Free Online ${wordleConfig.genre} Game`,
    alternateName: `${wordleConfig.name} Game`,
    description: `${wordleConfig.longDescription}. Features unlimited plays, hard mode, statistics tracking, and share results.`,
    genre: ["Word Game", "Puzzle", "Educational"],
    featureList: [
      "Classic Wordle gameplay",
      "Unlimited random words",
      "Hard mode challenge",
      "Statistics tracking with streaks",
      "Guess distribution visualization",
      "Share results with emoji grid",
      "Timer and best time tracking",
      "Responsive design for all devices",
      "Keyboard and on-screen input",
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
