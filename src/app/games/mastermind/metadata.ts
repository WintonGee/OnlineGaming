import { createGameMetadataAndStructuredData } from "@/lib/metadata";

export const gameOptions = {
  title: "Play Mastermind Game Free Online - No Ads | Code Breaking Puzzle",
  description:
    "Play Mastermind free online without ads! Crack the secret 4-color code in 10 attempts. Features classic gameplay with feedback pegs. No downloads required.",
  keywords: [
    "mastermind game",
    "play mastermind",
    "mastermind online",
    "free mastermind",
    "mastermind puzzle",
    "mastermind no ads",
    "code breaking game",
    "logic game",
    "mastermind browser game",
    "mastermind free online",
    "color code game",
    "deduction game",
    "puzzle game",
    "brain game",
    "strategy game",
  ],
  gamePath: "/games/mastermind",
  ogImage: "/og-mastermind.png",
  structuredData: {
    name: "Mastermind - Free Online Code Breaking Game",
    alternateName: "Mastermind Game",
    description:
      "Classic Mastermind code-breaking game - guess the secret 4-color code in 10 attempts with feedback pegs. Features 6 colors, unlimited plays, and keyboard support.",
    genre: ["Puzzle", "Logic", "Strategy"],
    featureList: [
      "Classic Mastermind gameplay",
      "4-peg secret code",
      "6 color options",
      "10 attempts to crack the code",
      "Black and white feedback pegs",
      "Keyboard and click input",
      "Game state persistence",
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
