import { createGameMetadataAndStructuredData } from "@/lib/metadata";
import { gameConfig } from "./config";

export const gameOptions = {
  title: `Play ${gameConfig.name} Game Free Online - No Ads | Zombie Survival ${gameConfig.genre}`,
  description: `${gameConfig.longDescription}. 2-player local multiplayer, 10 weapons, and endless survival waves. No downloads required.`,
  keywords: gameConfig.seoKeywords,
  gamePath: gameConfig.href,
  ogImage: gameConfig.ogImage,
  structuredData: {
    name: `${gameConfig.name} - Free Online Zombie Survival Shooter`,
    alternateName: `${gameConfig.name} 2Play`,
    description: `${gameConfig.longDescription}. Features 10 weapons, combo system, and endless waves of enemies.`,
    genre: ["Arcade", "Action", "Shooter", "Survival"],
    featureList: [
      "10 unlockable weapons",
      "Single player survival mode",
      "2-player cooperative mode",
      "2-player deathmatch mode",
      "Combo-based weapon unlocking",
      "Zombies and Devils enemies",
      "Health regeneration system",
      "Endless survival waves",
      "Local keyboard multiplayer",
      "No ads",
      "No registration required",
    ],
    ratingValue: "4.5",
    ratingCount: "500",
  },
};

export const { metadata, structuredData } =
  createGameMetadataAndStructuredData(gameOptions);
