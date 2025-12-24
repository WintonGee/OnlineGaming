import { Circle } from "lucide-react";
import { GameConfig } from "@/lib/types";

export const connectFourConfig: GameConfig = {
  name: "Connect Four",
  slug: "connect-four",
  href: "/games/connect-four",
  description: "Drop discs and get four in a row",
  longDescription: "Classic Connect Four - drop discs and connect four in a row to win",
  genre: "Strategy",
  icon: Circle,
};
