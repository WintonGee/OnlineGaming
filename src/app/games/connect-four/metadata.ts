import { createGameMetadataAndStructuredData } from "@/lib/metadata";

export const gameOptions = {
  title: "Play Connect Four Free Online - No Ads | Classic Strategy Game",
  description:
    "Play Connect Four free online without ads! Challenge the computer with Easy, Medium, and Hard AI modes, or play with a friend. Drop discs and get four in a row to win!",
  keywords: [
    "connect four",
    "connect 4",
    "connect four game",
    "play connect four",
    "connect four online",
    "free connect four",
    "connect four no ads",
    "four in a row",
    "connect four ai",
    "connect four strategy",
    "two player game",
    "classic game",
    "board game online",
    "connect four multiplayer",
    "drop four",
  ],
  gamePath: "/games/connect-four",
  ogImage: "/og-connect-four.png",
  structuredData: {
    name: "Connect Four - Free Online Strategy Game",
    alternateName: "Four in a Row",
    description:
      "Classic Connect Four game - drop discs and connect four in a row to win! Play against AI with three difficulty levels or challenge a friend in two-player mode.",
    genre: ["Strategy", "Board Game", "Puzzle"],
    featureList: [
      "Single player vs AI",
      "Three difficulty levels (Easy, Medium, Hard)",
      "Hard mode with advanced AI strategy",
      "Two player local multiplayer",
      "Clean, minimalist design",
      "Responsive for all devices",
      "Dark mode support",
      "No ads",
      "No registration required",
    ],
    ratingValue: "4.8",
    ratingCount: "1250",
  },
};

export const { metadata, structuredData } =
  createGameMetadataAndStructuredData(gameOptions);
