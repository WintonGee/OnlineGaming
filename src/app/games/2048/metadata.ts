import { createGameMetadataAndStructuredData } from "@/lib/games/metadata";

export const gameOptions = {
  title: "Play 2048 Game Free Online - No Ads | Classic Tile Puzzle",
  description:
    "Play the addictive 2048 tile puzzle game free online without ads! Slide tiles to combine numbers and reach 2048. Smooth animations, responsive design. No downloads required.",
  keywords: [
    "2048 game",
    "play 2048",
    "2048 online",
    "free 2048",
    "2048 puzzle",
    "2048 no ads",
    "tile game",
    "number puzzle",
    "2048 browser game",
    "classic 2048",
    "2048 online free",
    "sliding puzzle",
    "number game",
  ],
  gamePath: "/games/2048",
  ogImage: "/og-2048.png",
  structuredData: {
    name: "2048 - Free Online Tile Puzzle Game",
    alternateName: "2048 Game",
    description:
      "Classic 2048 tile sliding puzzle game - combine tiles with the same number to reach 2048. Addictive gameplay with smooth animations and responsive design.",
    genre: ["Puzzle", "Tile Matching", "Strategy"],
    featureList: [
      "Classic 2048 gameplay",
      "Smooth tile animations",
      "Score tracking and best score",
      "Responsive design for all devices",
      "Keyboard and swipe controls",
      "Dark mode support",
      "No ads",
      "No registration required",
    ],
    ratingValue: "4.7",
    ratingCount: "850",
  },
};

export const { metadata, structuredData } =
  createGameMetadataAndStructuredData(gameOptions);

