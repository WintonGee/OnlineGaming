import { createGameMetadataAndStructuredData } from "@/lib/metadata";

export const gameOptions = {
  title: "Play Snake Game Free Online - No Ads | Classic Arcade",
  description:
    "Play the classic Snake game free online without ads! Guide your snake to eat food and grow longer. Multiple difficulty levels, responsive controls, and dark mode. No downloads required.",
  keywords: [
    "snake game",
    "play snake",
    "snake online",
    "free snake",
    "snake no ads",
    "classic snake",
    "snake browser game",
    "arcade game",
    "snake game online free",
    "retro snake",
    "google snake",
    "snake game free",
  ],
  gamePath: "/games/snake",
  ogImage: "/og-snake.png",
  structuredData: {
    name: "Snake - Free Online Classic Arcade Game",
    alternateName: "Snake Game",
    description:
      "Classic Snake arcade game - guide your snake to eat food and grow longer. Multiple difficulty levels with responsive keyboard and swipe controls.",
    genre: ["Arcade", "Action", "Classic"],
    featureList: [
      "Classic Snake gameplay",
      "Multiple difficulty levels",
      "Keyboard and swipe controls",
      "Score tracking and high scores",
      "Responsive design for all devices",
      "Dark mode support",
      "No ads",
      "No registration required",
    ],
    ratingValue: "4.6",
    ratingCount: "720",
  },
};

export const { metadata, structuredData } =
  createGameMetadataAndStructuredData(gameOptions);
