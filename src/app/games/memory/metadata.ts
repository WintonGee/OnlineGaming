import { createGameMetadataAndStructuredData } from "@/lib/metadata";

export const gameOptions = {
  title: "Play Memory Game Free Online - No Ads | Card Matching Puzzle",
  description:
    "Play Memory (Concentration) game free online without ads! Match pairs of cards by remembering their positions. Multiple difficulty levels. No downloads required.",
  keywords: [
    "memory game online",
    "concentration game",
    "matching game",
    "card matching",
    "free memory game",
    "memory game no ads",
    "pairs game",
    "brain training game",
    "memory puzzle",
    "concentration card game",
    "matching pairs",
    "memory matching game",
  ],
  gamePath: "/games/memory",
  ogImage: "/og-memory.png",
  structuredData: {
    name: "Memory - Free Online Card Matching Game",
    alternateName: "Concentration Game",
    description:
      "Classic Memory matching game where you flip cards to find matching pairs. Features multiple difficulty levels and score tracking. Test and improve your memory!",
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
