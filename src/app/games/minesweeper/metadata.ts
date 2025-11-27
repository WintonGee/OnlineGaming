import { createGameMetadataAndStructuredData } from "@/lib/gameMetadata";

export const gameOptions = {
  title: "Play Minesweeper Free Online - No Ads | Classic Game",
  description:
    "Play classic Minesweeper game free online without ads! Choose from Easy, Medium, Hard difficulty or create custom boards. Track your best times. No downloads required.",
  keywords: [
    "minesweeper online",
    "play minesweeper",
    "free minesweeper",
    "minesweeper game",
    "minesweeper no ads",
    "classic minesweeper",
    "minesweeper browser",
    "windows minesweeper",
    "minesweeper puzzle",
    "minesweeper online free",
    "mine sweeper",
    "minesweeper classic game",
  ],
  gamePath: "/games/minesweeper",
  ogImage: "/og-minesweeper.png",
  structuredData: {
    name: "Minesweeper - Free Online Classic Game",
    alternateName: "Mine Sweeper",
    description:
      "Classic Minesweeper game with customizable difficulty levels - Easy, Medium, Hard, and Custom. Clear the board without hitting mines and track your best times.",
    genre: ["Puzzle", "Logic", "Strategy"],
    featureList: [
      "Classic Windows-style Minesweeper",
      "Multiple difficulty levels (Easy, Medium, Hard)",
      "Custom board settings",
      "Best time tracking",
      "Classic graphics and animations",
      "Responsive design for all devices",
      "Dark mode support",
      "No ads",
      "No registration required",
    ],
    ratingValue: "4.6",
    ratingCount: "750",
  },
};

export const { metadata, structuredData } =
  createGameMetadataAndStructuredData(gameOptions);

