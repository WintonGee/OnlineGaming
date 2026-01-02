import { TestConfig, TimeOption, WordCountOption } from "./types";

// Storage keys
export const TYPING_TEST_CONFIG_KEY = "typing-test-config";
export const TYPING_TEST_BESTS_KEY = "typing-test-personal-bests";

// Default configuration
export const DEFAULT_CONFIG: TestConfig = {
  mode: "time",
  timeLimit: 30,
  wordCount: 25,
};

// Available options
export const TIME_OPTIONS: TimeOption[] = [15, 30, 60, 120];
export const WORD_COUNT_OPTIONS: WordCountOption[] = [10, 25, 50, 100];

// Timing constants
export const WPM_SAMPLE_INTERVAL = 500; // Sample WPM every 500ms for consistency calc
export const WORD_LENGTH_STANDARD = 5; // Standard word length for WPM calculation

// Animation durations
export const CARET_BLINK_DURATION = 530; // ms
export const RESULT_ANIMATION_DURATION = 300; // ms

// Common English words for typing test (top 200 most common + some variety)
export const WORD_LIST: string[] = [
  // Common short words
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  // Medium words
  "very", "after", "thing", "right", "here", "much", "where", "before", "through",
  "being", "life", "world", "still", "last", "long", "great", "little", "own",
  "should", "need", "too", "system", "never", "down", "seem", "small", "part",
  "every", "place", "made", "while", "found", "keep", "old", "high", "again",
  "between", "under", "another", "turn", "house", "without", "around", "point",
  "thought", "together", "something", "nothing", "important", "against", "during",
  "different", "away", "always", "water", "enough", "almost", "until", "young",
  // Slightly longer words for challenge
  "example", "family", "government", "company", "problem", "however", "possible",
  "program", "question", "development", "business", "perhaps", "remember", "already",
  "everything", "although", "children", "information", "understand", "experience",
  "sometimes", "together", "beautiful", "important", "interesting", "different",
  "following", "national", "available", "according", "community", "president",
  // Common typing words
  "computer", "keyboard", "screen", "type", "write", "read", "fast", "slow",
  "quick", "speed", "test", "practice", "improve", "better", "best", "learn",
  "study", "focus", "mind", "hand", "finger", "letter", "word", "sentence",
  "text", "page", "book", "story", "game", "play", "fun", "easy", "hard",
  // Action words
  "run", "walk", "jump", "swim", "fly", "drive", "ride", "move", "stop", "start",
  "begin", "end", "open", "close", "push", "pull", "lift", "drop", "catch", "throw",
  // Descriptive words
  "big", "small", "tall", "short", "wide", "narrow", "thick", "thin", "heavy", "light",
  "dark", "bright", "hot", "cold", "warm", "cool", "wet", "dry", "soft", "hard",
  "smooth", "rough", "sharp", "dull", "loud", "quiet", "fast", "slow", "early", "late",
];

// Get random words from the word list
export function getRandomWords(count: number): string[] {
  const shuffled = [...WORD_LIST].sort(() => Math.random() - 0.5);
  // If we need more words than available, repeat the list
  const words: string[] = [];
  while (words.length < count) {
    const batch = shuffled.slice(0, Math.min(count - words.length, shuffled.length));
    words.push(...batch);
    shuffled.sort(() => Math.random() - 0.5); // Reshuffle for variety
  }
  return words;
}

// Calculate how many words to generate based on mode
export function getWordCount(config: TestConfig): number {
  if (config.mode === "words") {
    return config.wordCount;
  }
  // For time mode, generate enough words (estimate ~80 WPM max * time in minutes * 1.5 buffer)
  const estimatedWords = Math.ceil((80 * config.timeLimit) / 60 * 1.5);
  return Math.max(estimatedWords, 50); // At least 50 words
}
