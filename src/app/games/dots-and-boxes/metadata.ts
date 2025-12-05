import { createGameMetadataAndStructuredData } from "@/lib/metadata";

export const gameOptions = {
  title: "Play Dots and Boxes Free Online - No Ads | Classic Strategy Game",
  description:
    "Play Dots and Boxes free online without ads! Challenge the computer with Easy, Medium, and Hard AI modes, or play with a friend. Multiple grid sizes from 3x3 to 6x6. No downloads required.",
  keywords: [
    "dots and boxes",
    "dots and boxes game",
    "play dots and boxes",
    "dots and boxes online",
    "free dots and boxes",
    "dots and boxes no ads",
    "dots boxes game",
    "connect the dots game",
    "boxes game",
    "dots and boxes strategy",
    "two player game",
    "classic game",
    "pencil paper game",
    "dots and boxes multiplayer",
  ],
  gamePath: "/games/dots-and-boxes",
  ogImage: "/og-dots-and-boxes.png",
  structuredData: {
    name: "Dots and Boxes - Free Online Strategy Game",
    alternateName: "La Pipopipette",
    description:
      "Classic Dots and Boxes game - play against AI with three difficulty levels or challenge a friend in two-player mode. Multiple grid sizes and responsive design.",
    genre: ["Strategy", "Board Game", "Puzzle"],
    featureList: [
      "Single player vs AI",
      "Three difficulty levels (Easy, Medium, Hard)",
      "Hard mode with strategic AI",
      "Two player local multiplayer",
      "Multiple grid sizes (3x3, 4x4, 5x5, 6x6)",
      "Score tracking",
      "Clean, minimalist design",
      "Responsive for all devices",
      "Dark mode support",
      "No ads",
      "No registration required",
    ],
    ratingValue: "4.6",
    ratingCount: "520",
  },
};

export const { metadata, structuredData } =
  createGameMetadataAndStructuredData(gameOptions);
