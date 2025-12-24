import { createGameMetadataAndStructuredData } from "@/lib/metadata";
import { mastermindConfig } from "./config";

export const gameOptions = {
  title: `Play ${mastermindConfig.name} Game Free Online - No Ads | Code Breaking ${mastermindConfig.genre}`,
  description: `${mastermindConfig.longDescription}. Crack the secret 4-color code in 10 attempts. Features classic gameplay with feedback pegs. No downloads required.`,
  keywords: mastermindConfig.seoKeywords,
  gamePath: mastermindConfig.href,
  ogImage: mastermindConfig.ogImage,
  structuredData: {
    name: `${mastermindConfig.name} - Free Online Code Breaking Game`,
    alternateName: `${mastermindConfig.name} Game`,
    description: `${mastermindConfig.longDescription}. Guess the secret 4-color code in 10 attempts with feedback pegs. Features 6 colors, unlimited plays, and keyboard support.`,
    genre: ["Puzzle", "Logic", "Strategy"],
    featureList: [
      "Classic Mastermind gameplay",
      "4-peg secret code",
      "6 color options",
      "10 attempts to crack the code",
      "Black and white feedback pegs",
      "Keyboard and click input",
      "Game state persistence",
      "Responsive design for all devices",
      "Dark mode support",
      "No ads",
      "No registration required",
    ],
    ratingValue: "4.7",
    ratingCount: "890",
  },
};

export const { metadata, structuredData } =
  createGameMetadataAndStructuredData(gameOptions);
