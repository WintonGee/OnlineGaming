import { createGameMetadataAndStructuredData } from "@/lib/metadata";
import { ticTacToeConfig } from "./config";

export const gameOptions = {
  title: `Play ${ticTacToeConfig.name} Free Online - No Ads | Classic ${ticTacToeConfig.genre} Game`,
  description: `${ticTacToeConfig.longDescription}. Challenge the computer with Easy, Medium, and Hard AI modes, or play with a friend. No downloads required.`,
  keywords: ticTacToeConfig.seoKeywords,
  gamePath: ticTacToeConfig.href,
  ogImage: ticTacToeConfig.ogImage,
  structuredData: {
    name: `${ticTacToeConfig.name} - Free Online ${ticTacToeConfig.genre} Game`,
    alternateName: "Noughts and Crosses",
    description: `${ticTacToeConfig.longDescription}. Play against AI with three difficulty levels or challenge a friend in two-player mode. Features score tracking and a clean, responsive design.`,
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
