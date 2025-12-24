import { Brain } from "lucide-react";
import { GameConfig } from "@/lib/types";

export const memoryConfig: GameConfig = {
  name: "Memory",
  slug: "memory",
  href: "/games/memory",
  description: "Match pairs of cards by memory",
  longDescription: "Classic Memory card matching game with multiple difficulty levels",
  genre: "Puzzle",
  icon: Brain,
};
