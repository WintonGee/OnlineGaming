import Link from "next/link";
import { Grid3x3, Grid2x2, Bomb, Type, HelpCircle, X, BoxSelect, Circle } from "lucide-react";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GamesAdFree",
    url: "https://gamesadfree.com",
    description:
      "Free online games without ads - Play Sudoku, 2048, Minesweeper, Wordle, Hangman, and Tic Tac Toe",
    publisher: {
      "@type": "Organization",
      name: "GamesAdFree",
      url: "https://gamesadfree.com",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://gamesadfree.com/?s={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const gamesData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Free Online Games",
    description: "Collection of free online games without ads",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Game",
          name: "Sudoku",
          url: "https://gamesadfree.com/games/sudoku",
          description:
            "Free online Sudoku puzzle game with multiple difficulty levels",
          genre: "Puzzle",
          gamePlatform: "Web browser",
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Game",
          name: "2048",
          url: "https://gamesadfree.com/games/2048",
          description: "Classic 2048 tile sliding puzzle game",
          genre: "Puzzle",
          gamePlatform: "Web browser",
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "Game",
          name: "Minesweeper",
          url: "https://gamesadfree.com/games/minesweeper",
          description: "Classic Minesweeper game with customizable difficulty",
          genre: "Puzzle",
          gamePlatform: "Web browser",
        },
      },
      {
        "@type": "ListItem",
        position: 4,
        item: {
          "@type": "Game",
          name: "Wordle",
          url: "https://gamesadfree.com/games/wordle",
          description:
            "Guess the 5-letter word in 6 tries with color-coded feedback",
          genre: "Word Game",
          gamePlatform: "Web browser",
        },
      },
      {
        "@type": "ListItem",
        position: 5,
        item: {
          "@type": "Game",
          name: "Hangman",
          url: "https://gamesadfree.com/games/hangman",
          description: "Classic word guessing game with multiple categories",
          genre: "Word Game",
          gamePlatform: "Web browser",
        },
      },
      {
        "@type": "ListItem",
        position: 6,
        item: {
          "@type": "Game",
          name: "Tic Tac Toe",
          url: "https://gamesadfree.com/games/tic-tac-toe",
          description: "Classic Tic Tac Toe with AI opponents and two-player mode",
          genre: "Strategy",
          gamePlatform: "Web browser",
        },
      },
      {
        "@type": "ListItem",
        position: 7,
        item: {
          "@type": "Game",
          name: "Dots and Boxes",
          url: "https://gamesadfree.com/games/dots-and-boxes",
          description: "Classic Dots and Boxes with AI opponents and two-player mode",
          genre: "Strategy",
          gamePlatform: "Web browser",
        },
      },
      {
        "@type": "ListItem",
        position: 8,
        item: {
          "@type": "Game",
          name: "Connect Four",
          url: "https://gamesadfree.com/games/connect-four",
          description: "Classic Connect Four - drop discs and connect four in a row to win",
          genre: "Strategy",
          gamePlatform: "Web browser",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gamesData) }}
      />
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-serif font-bold text-black dark:text-white mb-6">
              Online Games
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl mx-auto">
              Play for free with no annoying ads or sign-ups.
            </p>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Link
              href="/games/sudoku"
              className="group border border-gray-300 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center mb-4">
                  <Grid3x3 className="h-10 w-10 text-black dark:text-white group-hover:scale-110 transition-transform" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-black dark:text-white mb-2">
                  Sudoku
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Fill the grid with numbers 1-9
                </p>
              </div>
            </Link>

            <Link
              href="/games/2048"
              className="group border border-gray-300 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center mb-4">
                  <Grid2x2 className="h-10 w-10 text-black dark:text-white group-hover:scale-110 transition-transform" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-black dark:text-white mb-2">
                  2048
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Combine tiles to reach 2048
                </p>
              </div>
            </Link>

            <Link
              href="/games/minesweeper"
              className="group border border-gray-300 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center mb-4">
                  <Bomb className="h-10 w-10 text-black dark:text-white group-hover:scale-110 transition-transform" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-black dark:text-white mb-2">
                  Minesweeper
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Clear the board without hitting mines
                </p>
              </div>
            </Link>

            <Link
              href="/games/wordle"
              className="group border border-gray-300 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center mb-4">
                  <Type className="h-10 w-10 text-black dark:text-white group-hover:scale-110 transition-transform" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-black dark:text-white mb-2">
                  Wordle
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Guess the 5-letter word in 6 tries
                </p>
              </div>
            </Link>

            <Link
              href="/games/hangman"
              className="group border border-gray-300 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center mb-4">
                  <HelpCircle className="h-10 w-10 text-black dark:text-white group-hover:scale-110 transition-transform" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-black dark:text-white mb-2">
                  Hangman
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Guess letters to reveal the hidden word
                </p>
              </div>
            </Link>

            <Link
              href="/games/tic-tac-toe"
              className="group border border-gray-300 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center mb-4">
                  <X className="h-10 w-10 text-black dark:text-white group-hover:scale-110 transition-transform" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-black dark:text-white mb-2">
                  Tic Tac Toe
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Classic strategy game vs AI or a friend
                </p>
              </div>
            </Link>

            <Link
              href="/games/dots-and-boxes"
              className="group border border-gray-300 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center mb-4">
                  <BoxSelect className="h-10 w-10 text-black dark:text-white group-hover:scale-110 transition-transform" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-black dark:text-white mb-2">
                  Dots and Boxes
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Connect dots and claim boxes
                </p>
              </div>
            </Link>

            <Link
              href="/games/connect-four"
              className="group border border-gray-300 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center mb-4">
                  <Circle className="h-10 w-10 text-black dark:text-white group-hover:scale-110 transition-transform" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-black dark:text-white mb-2">
                  Connect Four
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Drop discs and get four in a row
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
