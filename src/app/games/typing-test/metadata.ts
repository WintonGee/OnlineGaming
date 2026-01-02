import { createGameMetadataAndStructuredData } from "@/lib/metadata";
import { typingTestConfig } from "./config";

const gameOptions = {
  title: `Play ${typingTestConfig.name} Online Free - WPM Speed Test | ${typingTestConfig.genre}`,
  description: `${typingTestConfig.longDescription}. Free to play with no ads. Track your typing speed and accuracy.`,
  keywords: typingTestConfig.seoKeywords,
  gamePath: typingTestConfig.href,
  ogImage: typingTestConfig.ogImage,
  structuredData: {
    name: `${typingTestConfig.name} - Free Online Typing Speed Test`,
    alternateName: "WPM Test",
    description: typingTestConfig.longDescription,
    genre: [typingTestConfig.genre, "Browser Game", "Free Online Game", "Educational"],
    featureList: [
      "No download required",
      "Multiple test modes (time and word count)",
      "Real-time WPM and accuracy tracking",
      "Personal best tracking",
      "Works on mobile and desktop",
      "Dark mode support",
    ],
    ratingValue: "4.7",
    ratingCount: "850",
  },
};

export const { metadata, structuredData } =
  createGameMetadataAndStructuredData(gameOptions);
