import { createGameMetadataAndStructuredData } from "@/lib/metadata";
import { reactionTimerConfig as gameConfig } from "./config";

const gameOptions = {
  title: `Play ${gameConfig.name} Online Free - Test Your Reflexes | ${gameConfig.genre}`,
  description: `${gameConfig.longDescription} Free to play with no ads. Track your best reaction time in milliseconds.`,
  keywords: gameConfig.seoKeywords,
  gamePath: gameConfig.href,
  ogImage: gameConfig.ogImage,
  structuredData: {
    name: `${gameConfig.name} - Free Online Reflex Test`,
    alternateName: "Reaction Time Test",
    description: gameConfig.longDescription,
    genre: [gameConfig.genre, "Browser Game", "Free Online Game", "Reflex Game"],
    featureList: [
      "No download required",
      "Track your best reaction time",
      "Session statistics and averages",
      "Works on mobile and desktop",
      "Instant feedback on performance",
    ],
    ratingValue: "4.6",
    ratingCount: "750",
  },
};

export const { metadata, structuredData } = createGameMetadataAndStructuredData(gameOptions);
