import Link from 'next/link';
import { Grid3x3, Grid2x2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-serif font-bold text-black dark:text-white mb-6">
            Games
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl mx-auto">
            Play classic games and puzzles
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
        </div>
      </div>
    </div>
  );
}
