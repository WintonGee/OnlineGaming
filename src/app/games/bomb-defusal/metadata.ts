import { createGameMetadataAndStructuredData } from "@/lib/metadata";
import { bombDefusalConfig } from "./config";

export const gameOptions = {
  title: `Play ${bombDefusalConfig.name} Free Online - Logic Puzzle Game | No Ads`,
  description: `${bombDefusalConfig.longDescription}. Solve wire puzzles, button sequences, Simon Says, memory games, passwords, and morse code before time runs out. Multiple difficulty levels.`,
  keywords: bombDefusalConfig.seoKeywords,
  gamePath: bombDefusalConfig.href,
  ogImage: bombDefusalConfig.ogImage,
  structuredData: {
    name: `${bombDefusalConfig.name} - Free Online Puzzle Game`,
    alternateName: "Bomb Defusal Puzzle",
    description: `${bombDefusalConfig.longDescription}. Solve wire puzzles, button sequences, Simon Says, memory games, passwords, and morse code. Track your best times across difficulties.`,
    genre: ["Puzzle", "Logic", "Strategy", "Thriller"],
    featureList: [
      "6 unique puzzle modules to solve",
      "Wires module with color-based logic",
      "Button module with timing mechanics",
      "Simon Says with color sequences",
      "Memory module with 5 stages",
      "Password module with letter cycling",
      "Morse Code module with frequency tuning",
      "Multiple difficulty levels (Easy, Medium, Hard)",
      "Built-in manual for single-player mode",
      "Best time tracking per difficulty",
      "No ads",
      "No registration required",
    ],
    ratingValue: "4.7",
    ratingCount: "320",
  },
};

export const { metadata, structuredData } =
  createGameMetadataAndStructuredData(gameOptions);
