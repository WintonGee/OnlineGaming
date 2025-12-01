# Wordle Word Lists

This directory contains the official Wordle word lists for 5-letter words only.

## Files Required

- `solutions.json` - Array of ~2,309 common 5-letter words used as daily solutions
- `valid.json` - Array of ~10,657 5-letter words accepted as valid guesses

## Getting the Official Word Lists

The official Wordle word lists are available from various sources:

1. **GitHub Repositories**: Search for "wordle word list" or "wordle solutions valid guesses"
   - Many repositories contain the original Wordle word lists extracted from the game
   - Look for files named `solutions.json` and `validGuesses.json` or similar

2. **Word List Sources**:
   - The original Wordle game uses ~2,309 solution words and ~10,657 valid guess words
   - These lists are in the public domain and can be found in various GitHub repositories

3. **Format**:
   - Both files should be JSON arrays of lowercase strings
   - Example: `["about", "above", "abuse", ...]`

## Current Status

The current files (`solutions.json` and `valid.json`) contain placeholder word lists from the previous implementation. **You should replace these with the official Wordle word lists** to match the exact behavior of the original game.

## Verification

After adding the official lists, verify:
- `solutions.json` contains approximately 2,309 words
- `valid.json` contains approximately 10,657 words
- All words are exactly 5 letters long
- All words are lowercase
- `valid.json` includes all words from `solutions.json` plus additional valid guess words

