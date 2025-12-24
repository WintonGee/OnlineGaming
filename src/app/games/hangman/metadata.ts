import { createGameMetadataAndStructuredData } from "@/lib/metadata";
import { hangmanConfig } from "./config";

export const gameOptions = {
  title: `Play ${hangmanConfig.name} Game Free Online - No Ads | Classic Word Guessing`,
  description: `${hangmanConfig.longDescription}. Guess letters to reveal hidden words before the hangman is complete. No ads, no downloads required.`,
  keywords: hangmanConfig.seoKeywords,
  gamePath: hangmanConfig.href,
  ogImage: hangmanConfig.ogImage,
  structuredData: {
    name: `${hangmanConfig.name} - Free Online ${hangmanConfig.genre} Game`,
    alternateName: `${hangmanConfig.name} Game`,
    description: `${hangmanConfig.longDescription}. Choose from 8 different categories and guess letters to reveal the hidden word before the hangman is complete.`,
    genre: ["Word Game", "Puzzle", "Educational"],
    featureList: [
      "Classic hangman gameplay",
      "8 word categories (Animals, Countries, Foods, Movies, Sports, Music, Nature, Technology)",
      "Keyboard and click support",
      "Progress saving",
      "Dark mode support",
      "No ads or downloads",
      "Easy to add new categories",
    ],
    ratingValue: "4.7",
    ratingCount: "350",
  },
};

export const { metadata, structuredData } =
  createGameMetadataAndStructuredData(gameOptions);
