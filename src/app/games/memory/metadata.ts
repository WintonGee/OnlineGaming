import { createGameMetadataAndStructuredData } from "@/lib/metadata";
import { memoryConfig } from "./config";

export const gameOptions = {
  title: `Play ${memoryConfig.name} Game Free Online - No Ads | Card Matching ${memoryConfig.genre}`,
  description: `${memoryConfig.longDescription}. Match pairs of cards by remembering their positions. No downloads required.`,
  keywords: memoryConfig.seoKeywords,
  gamePath: memoryConfig.href,
  ogImage: memoryConfig.ogImage,
  structuredData: {
    name: `${memoryConfig.name} - Free Online Card Matching Game`,
    alternateName: "Concentration Game",
    description: `${memoryConfig.longDescription}. Flip cards to find matching pairs. Features score tracking. Test and improve your memory!`,
    genre: ["Puzzle", "Memory", "Educational", "Card Game"],
    featureList: [
      "Classic Memory/Concentration gameplay",
      "Three difficulty levels (Easy, Medium, Hard)",
      "Best score tracking for each difficulty",
      "Beautiful card flip animations",
      "Timer to track your speed",
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
