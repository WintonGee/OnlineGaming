import { createGameMetadataAndStructuredData } from "@/lib/metadata";
import { wordSearchConfig } from "./config";

export const gameOptions = {
  title: `Play ${wordSearchConfig.name} Game Free Online - No Ads | ${wordSearchConfig.genre}`,
  description: `${wordSearchConfig.longDescription}. 12 categories and 3 difficulty levels. No ads, no downloads required.`,
  keywords: wordSearchConfig.seoKeywords,
  gamePath: wordSearchConfig.href,
  ogImage: wordSearchConfig.ogImage,
  structuredData: {
    name: `${wordSearchConfig.name} - Free Online ${wordSearchConfig.genre} Game`,
    alternateName: `${wordSearchConfig.name} Puzzle`,
    description: `${wordSearchConfig.longDescription}. Choose from 12 categories and 3 difficulty levels.`,
    genre: ["Word Game", "Puzzle", "Educational"],
    featureList: [
      "Classic word search gameplay",
      "12 word categories (Animals, Food, Sports, Nature, Science, Technology, Music, Geography, Colors, Space, Weather, Professions)",
      "3 difficulty levels (Easy, Medium, Hard)",
      "Touch and mouse support",
      "Progress saving",
      "Dark mode support",
      "No ads or downloads",
    ],
    ratingValue: "4.7",
    ratingCount: "280",
  },
};

export const { metadata, structuredData } =
  createGameMetadataAndStructuredData(gameOptions);
