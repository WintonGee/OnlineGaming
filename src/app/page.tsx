import type { Metadata } from 'next';
import Link from 'next/link';
import { Grid3x3, Grid2x2, Bomb } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free Online Games - Play Sudoku, 2048, Minesweeper Without Ads',
  description: 'Play the best free online games without ads! Enjoy classic Sudoku puzzles, addictive 2048 tile game, and challenging Minesweeper. No downloads, no registration required. Start playing instantly in your browser.',
  keywords: ['free games online', 'no ads games', 'sudoku free', '2048 game', 'minesweeper online', 'play games online', 'browser games free', 'puzzle games', 'logic games'],
  openGraph: {
    title: 'Free Online Games - Play Sudoku, 2048, Minesweeper Without Ads',
    description: 'Play the best free online games without ads! Enjoy Sudoku, 2048, and Minesweeper instantly in your browser.',
    url: 'https://gamesadfree.com',
    type: 'website',
  },
  alternates: {
    canonical: 'https://gamesadfree.com',
  },
};

export default function Home() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GamesAdFree',
    url: 'https://gamesadfree.com',
    description: 'Free online games without ads - Play Sudoku, 2048, and Minesweeper',
    publisher: {
      '@type': 'Organization',
      name: 'GamesAdFree',
      url: 'https://gamesadfree.com',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://gamesadfree.com/?s={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const gamesData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Free Online Games',
    description: 'Collection of free online games without ads',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Game',
          name: 'Sudoku',
          url: 'https://gamesadfree.com/games/sudoku',
          description: 'Free online Sudoku puzzle game with multiple difficulty levels',
          genre: 'Puzzle',
          gamePlatform: 'Web browser',
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Game',
          name: '2048',
          url: 'https://gamesadfree.com/games/2048',
          description: 'Classic 2048 tile sliding puzzle game',
          genre: 'Puzzle',
          gamePlatform: 'Web browser',
        },
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'Game',
          name: 'Minesweeper',
          url: 'https://gamesadfree.com/games/minesweeper',
          description: 'Classic Minesweeper game with customizable difficulty',
          genre: 'Puzzle',
          gamePlatform: 'Web browser',
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
              Free Online Games - No Ads
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl mx-auto">
              Play classic puzzle games completely free without any ads. No downloads or registration required.
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
        </div>
      </div>
      </div>
    </>
  );
}
