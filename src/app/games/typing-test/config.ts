import { GameConfig } from "@/lib/types";
import { Keyboard } from "lucide-react";

export const typingTestConfig: GameConfig = {
  name: "Typing Test",
  slug: "typing-test",
  href: "/games/typing-test",
  description: "Test your typing speed and accuracy with this MonkeyType-inspired WPM test.",
  longDescription:
    "Challenge yourself with our typing speed test. Measure your words per minute (WPM), accuracy, and consistency. Choose between time-based tests (15, 30, 60, or 120 seconds) or word-count tests (10, 25, 50, or 100 words). Track your personal bests and improve your typing skills with real-time feedback.",
  genre: "Skill Game",
  icon: Keyboard,
  ogImage: "/og-typing-test.png",
  seoKeywords: [
    "typing test",
    "typing speed test",
    "wpm test",
    "words per minute",
    "typing practice",
    "typing game",
    "keyboard test",
    "typing accuracy",
    "free typing test",
    "online typing test",
    "monkeytype alternative",
    "typing speed",
    "improve typing",
    "touch typing",
    "typing trainer",
  ],
};
