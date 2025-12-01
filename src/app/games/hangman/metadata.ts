import { createGameMetadataAndStructuredData } from "@/lib/metadata";

export const gameOptions = {
  title: "Play Hangman Game Free Online - No Ads | Classic Word Guessing",
  description:
    "Free online Hangman word guessing game with 8 categories. Guess letters to reveal hidden words before the hangman is complete. No ads, no downloads required.",
  keywords: [
    "hangman",
    "hangman game",
    "word game",
    "guessing game",
    "free hangman",
    "online hangman",
    "word puzzle",
    "letter game",
    "vocabulary game",
    "educational game",
  ],
  gamePath: "/games/hangman",
  ogImage: "/og-hangman.png",
  structuredData: {
    name: "Hangman - Free Online Word Guessing Game",
    alternateName: "Hangman Game",
    description:
      "Play the classic Hangman word guessing game online for free. Choose from 8 different categories and guess letters to reveal the hidden word before the hangman is complete.",
    genre: ["Word Game", "Puzzle", "Educational"],
    featureList: [
      "Classic hangman gameplay",
      "8 word categories (Animals, Countries, Foods, Movies, Sports, Music, Nature, Technology)",
      "Keyboard and click support",
      "Progress saving",
      "Dark mode support",
      "No ads or downloads",
      "Easy to add new categories",
    ],
    ratingValue: "4.7",
    ratingCount: "350",
  },
};

export const { metadata, structuredData } =
  createGameMetadataAndStructuredData(gameOptions);
