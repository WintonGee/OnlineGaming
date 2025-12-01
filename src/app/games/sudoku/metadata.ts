import { createGameMetadataAndStructuredData } from "@/lib/metadata";

export const gameOptions = {
  title: "Play Sudoku Free Online - No Ads | Multiple Difficulty Levels",
  description:
    "Play free Sudoku online without ads! Choose from Easy, Medium, Hard, and Expert levels. Features auto-candidates, hints, undo, and more. No registration or download required.",
  keywords: [
    "sudoku online",
    "free sudoku",
    "sudoku game",
    "play sudoku",
    "sudoku puzzle",
    "sudoku no ads",
    "online sudoku free",
    "sudoku easy",
    "sudoku hard",
    "sudoku expert",
    "daily sudoku",
    "sudoku solver",
    "sudoku hints",
    "web sudoku",
  ],
  gamePath: "/games/sudoku",
  ogImage: "/og-sudoku.png",
  structuredData: {
    name: "Sudoku - Free Online Puzzle Game",
    alternateName: "Sudoku Puzzle",
    description:
      "Free online Sudoku puzzle game with multiple difficulty levels - Easy, Medium, Hard, and Expert. Features auto-candidates, hints, undo functionality, and more.",
    genre: ["Puzzle", "Logic", "Brain Teaser"],
    featureList: [
      "Multiple difficulty levels (Easy, Medium, Hard, Expert)",
      "Auto-candidate mode",
      "Hints and cell checking",
      "Undo functionality",
      "Responsive design",
      "Dark mode support",
      "No ads",
      "No registration required",
    ],
    ratingValue: "4.8",
    ratingCount: "1000",
  },
};

export const { metadata, structuredData } =
  createGameMetadataAndStructuredData(gameOptions);
