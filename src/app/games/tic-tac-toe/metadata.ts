import { createGameMetadataAndStructuredData } from "@/lib/metadata";

export const gameOptions = {
  title: "Play Tic Tac Toe Free Online - No Ads | Classic Strategy Game",
  description:
    "Play Tic Tac Toe free online without ads! Challenge the computer with Easy, Medium, and Hard AI modes, or play with a friend. No downloads required.",
  keywords: [
    "tic tac toe",
    "tic tac toe game",
    "play tic tac toe",
    "tic tac toe online",
    "free tic tac toe",
    "tic tac toe no ads",
    "noughts and crosses",
    "xs and os",
    "tic tac toe ai",
    "tic tac toe strategy",
    "two player game",
    "classic game",
    "board game online",
    "tic tac toe multiplayer",
  ],
  gamePath: "/games/tic-tac-toe",
  ogImage: "/og-tic-tac-toe.png",
  structuredData: {
    name: "Tic Tac Toe - Free Online Strategy Game",
    alternateName: "Noughts and Crosses",
    description:
      "Classic Tic Tac Toe game - play against AI with three difficulty levels or challenge a friend in two-player mode. Features score tracking and a clean, responsive design.",
    genre: ["Strategy", "Board Game", "Puzzle"],
    featureList: [
      "Single player vs AI",
      "Three difficulty levels (Easy, Medium, Hard)",
      "Hard mode with unbeatable AI (Minimax)",
      "Two player local multiplayer",
      "Score tracking",
      "Clean, minimalist design",
      "Responsive for all devices",
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
