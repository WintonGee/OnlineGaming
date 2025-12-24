import { LucideIcon } from "lucide-react";

export interface GameConfig {
  name: string;
  slug: string;
  href: string;
  description: string;
  longDescription: string;
  genre: string;
  icon: LucideIcon;
}
