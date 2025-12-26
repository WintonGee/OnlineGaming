import { GameConfig } from "@/lib/types";
import { Zap } from "lucide-react";

export const reactionTimerConfig: GameConfig = {
  name: "Reaction Timer",
  slug: "reaction-timer",
  href: "/games/reaction-timer",
  description: "Test your reflexes! Click as fast as you can when the screen turns green.",
  longDescription:
    "Challenge your reflexes with this simple yet addictive reaction time test. Wait for the screen to turn green, then click as fast as possible. Track your reaction time in milliseconds and try to beat your best score. The average human reaction time is around 250ms - can you do better?",
  genre: "Arcade",
  icon: Zap,
  ogImage: "/og-reaction-timer.png",
  seoKeywords: [
    "reaction time test",
    "reaction timer online",
    "reflex test",
    "reaction speed test",
    "click speed test",
    "human benchmark",
    "reaction time game",
    "test your reflexes",
    "free reaction test",
    "millisecond reaction time",
  ],
};
