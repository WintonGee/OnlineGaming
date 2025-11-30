import { createGameMetadataAndStructuredData } from "@/lib/games/metadata";

export const gameOptions = {
  title: "Play Wordle Game Free Online - No Ads | Word Puzzle Challenge",
  description:
    "Play Wordle free online without ads! Guess the 5-letter word in 6 tries. Features hard mode, statistics tracking, and unlimited plays. No downloads required.",
  keywords: [
    "wordle game",
    "play wordle",
    "wordle online",
    "free wordle",
    "wordle puzzle",
    "wordle no ads",
    "word game",
    "5 letter word game",
    "wordle browser game",
    "wordle unlimited",
    "wordle online free",
    "word puzzle",
    "vocabulary game",
    "daily word game",
    "guess the word",
  ],
  gamePath: "/games/wordle",
  ogImage: "/og-wordle.png",
  structuredData: {
    name: "Wordle - Free Online Word Puzzle Game",
    alternateName: "Wordle Game",
    description:
      "Classic Wordle word guessing game - guess the 5-letter word in 6 tries with color-coded feedback. Features unlimited plays, hard mode, statistics tracking, and share results.",
    genre: ["Word Game", "Puzzle", "Educational"],
    featureList: [
      "Classic Wordle gameplay",
      "Unlimited random words",
      "Hard mode challenge",
      "Statistics tracking with streaks",
      "Guess distribution visualization",
      "Share results with emoji grid",
      "Timer and best time tracking",
      "Responsive design for all devices",
      "Keyboard and on-screen input",
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
