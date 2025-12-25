import { createGameMetadataAndStructuredData } from "@/lib/metadata";
import { solitaireConfig } from "./config";

const gameOptions = {
  title: `Play ${solitaireConfig.name} Online Free - Klondike Card Game | No Ads`,
  description: solitaireConfig.longDescription,
  keywords: solitaireConfig.seoKeywords,
  gamePath: solitaireConfig.href,
  ogImage: solitaireConfig.ogImage,
  structuredData: {
    name: `${solitaireConfig.name} - Free Online Klondike Card Game`,
    alternateName: "Klondike Solitaire",
    description: solitaireConfig.longDescription,
    genre: ["Card Game", "Solitaire", "Puzzle", "Browser Game", "Free Online Game"],
    featureList: [
      "No download required",
      "Draw 1 or Draw 3 modes",
      "Track your moves",
      "Auto-complete when possible",
      "Works on mobile and desktop",
      "Drag and drop or click to move",
    ],
    ratingValue: "4.6",
    ratingCount: "1200",
  },
};

export const { metadata, structuredData } = createGameMetadataAndStructuredData(gameOptions);
