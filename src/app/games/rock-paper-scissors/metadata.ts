import { createGameMetadataAndStructuredData } from "@/lib/metadata";
import { rockPaperScissorsConfig as gameConfig } from "./config";

const gameOptions = {
  title: `Play ${gameConfig.name} Online Free - Classic Hand Game | ${gameConfig.genre}`,
  description: `${gameConfig.longDescription} Free to play with no ads. Track your win streak and statistics.`,
  keywords: gameConfig.seoKeywords,
  gamePath: gameConfig.href,
  ogImage: gameConfig.ogImage,
  structuredData: {
    name: `${gameConfig.name} - Free Online Game`,
    alternateName: "RPS, Roshambo",
    description: gameConfig.longDescription,
    genre: [gameConfig.genre, "Browser Game", "Free Online Game", "Classic Game"],
    featureList: [
      "No download required",
      "Animated hand battles",
      "Win streak tracking",
      "Session statistics",
      "Works on mobile and desktop",
      "Pure random AI opponent",
    ],
    ratingValue: "4.5",
    ratingCount: "890",
  },
};

export const { metadata, structuredData } = createGameMetadataAndStructuredData(gameOptions);
