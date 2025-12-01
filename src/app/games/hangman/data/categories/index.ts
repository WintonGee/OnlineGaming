/**
 * Category Index
 *
 * This file automatically exports all categories.
 * To add a new category:
 * 1. Create a new file in this directory (e.g., colors.ts)
 * 2. Export a WordCategory object with name and words
 * 3. Import and add it to the array below
 *
 * Example new category file (colors.ts):
 * ```typescript
 * import { WordCategory } from "../../types";
 *
 * export const colors: WordCategory = {
 *   name: "Colors",
 *   words: ["RED", "BLUE", "GREEN", ...],
 * };
 * ```
 */

import { animals } from "./animals";
import { countries } from "./countries";
import { foods } from "./foods";
import { movies } from "./movies";
import { sports } from "./sports";
import { music } from "./music";
import { nature } from "./nature";
import { technology } from "./technology";
import { colors } from "./colors";
import { vehicles } from "./vehicles";
import { professions } from "./professions";
import { bodyParts } from "./bodyParts";
import { clothing } from "./clothing";
import { furniture } from "./furniture";
import { science } from "./science";
import { geography } from "./geography";

/**
 * All available word categories
 * Add new categories to this array to make them available in the game
 */
export const allCategories = [
  animals,
  countries,
  foods,
  movies,
  sports,
  music,
  nature,
  technology,
  colors,
  vehicles,
  professions,
  bodyParts,
  clothing,
  furniture,
  science,
  geography,
];
