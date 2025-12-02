import { WordCategory } from "../types";
import { allCategories as importedCategories } from "./categories/index";

/**
 * All word categories
 * Categories are loaded from individual files in the categories/ directory
 *
 * To add a new category:
 * 1. Create a new file in data/categories/ (e.g., colors.ts)
 * 2. Export a WordCategory object
 * 3. Import and add it to the allCategories array in categories/index.ts
 */
export const WORD_CATEGORIES: WordCategory[] = importedCategories;

/**
 * Get a random word from a specific category
 */
export function getRandomWord(categoryName: string): string {
  const category = WORD_CATEGORIES.find((cat) => cat.name === categoryName);
  if (!category || category.words.length === 0) {
    throw new Error(`Category "${categoryName}" not found or empty`);
  }
  const randomIndex = Math.floor(Math.random() * category.words.length);
  return category.words[randomIndex];
}

/**
 * Get a random word from multiple categories
 * Combines all words from the selected categories and picks one randomly
 * Returns both the word and the category it belongs to
 */
export function getRandomWordFromCategories(categoryNames: string[]): { word: string; category: string } {
  // If no categories specified, use all categories
  const selectedCategories = categoryNames.length === 0
    ? WORD_CATEGORIES.map(cat => cat.name)
    : categoryNames;

  // Collect all words from selected categories with their category names
  const allWordsWithCategories: { word: string; category: string }[] = [];
  for (const categoryName of selectedCategories) {
    const category = WORD_CATEGORIES.find((cat) => cat.name === categoryName);
    if (category && category.words.length > 0) {
      for (const word of category.words) {
        allWordsWithCategories.push({ word, category: category.name });
      }
    }
  }

  if (allWordsWithCategories.length === 0) {
    throw new Error("No words found in selected categories");
  }

  const randomIndex = Math.floor(Math.random() * allWordsWithCategories.length);
  return allWordsWithCategories[randomIndex];
}

/**
 * Get a random category
 */
export function getRandomCategory(): WordCategory {
  const randomIndex = Math.floor(Math.random() * WORD_CATEGORIES.length);
  return WORD_CATEGORIES[randomIndex];
}
