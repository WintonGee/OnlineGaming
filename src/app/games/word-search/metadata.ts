import { createGameMetadataAndStructuredData } from "@/lib/metadata";

export const gameOptions = {
  title: "Play Word Search Game Free Online - No Ads | Puzzle Game",
  description:
    "Free online Word Search puzzle game with 12 categories and 3 difficulty levels. Find hidden words in the grid. No ads, no downloads required.",
  keywords: [
    "word search",
    "word search game",
    "word puzzle",
    "find words",
    "free word search",
    "online word search",
    "puzzle game",
    "word game",
    "brain game",
    "vocabulary game",
  ],
  gamePath: "/games/word-search",
  ogImage: "/og-word-search.png",
  structuredData: {
    name: "Word Search - Free Online Word Puzzle Game",
    alternateName: "Word Search Puzzle",
    description:
      "Play the classic Word Search puzzle game online for free. Find hidden words in a grid of letters. Choose from 12 categories and 3 difficulty levels.",
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
