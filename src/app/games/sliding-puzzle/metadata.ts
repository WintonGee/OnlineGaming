import { createGameMetadataAndStructuredData } from "@/lib/metadata";

export const gameOptions = {
  title: "Play Sliding Puzzle Free Online - No Ads | 15 Puzzle Game",
  description:
    "Play the classic Sliding Puzzle (15 Puzzle) free online without ads! Choose from 3x3, 4x4, or 5x5 grids. Track your best times and moves. No downloads required.",
  keywords: [
    "sliding puzzle online",
    "15 puzzle game",
    "play sliding puzzle",
    "free puzzle game",
    "sliding puzzle no ads",
    "number puzzle game",
    "tile sliding puzzle",
    "gem puzzle online",
    "15 puzzle solver",
    "sliding tile puzzle",
    "puzzle game free",
    "brain teaser game",
  ],
  gamePath: "/games/sliding-puzzle",
  ogImage: "/og-sliding-puzzle.png",
  structuredData: {
    name: "Sliding Puzzle - Free Online 15 Puzzle Game",
    alternateName: "15 Puzzle",
    description:
      "Classic Sliding Puzzle game with multiple grid sizes - 3x3 Easy, 4x4 Medium (classic 15-puzzle), and 5x5 Hard. Arrange numbered tiles in order by sliding them into the empty space.",
    genre: ["Puzzle", "Logic", "Brain Teaser"],
    featureList: [
      "Classic 15-puzzle gameplay",
      "Multiple difficulty levels (3x3, 4x4, 5x5)",
      "Best time and move tracking",
      "Keyboard and touch controls",
      "Swipe gesture support",
      "Responsive design for all devices",
      "Dark mode support",
      "No ads",
      "No registration required",
    ],
    ratingValue: "4.5",
    ratingCount: "420",
  },
};

export const { metadata, structuredData } =
  createGameMetadataAndStructuredData(gameOptions);
