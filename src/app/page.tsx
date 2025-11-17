import Link from 'next/link';
import { Grid3x3 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-serif font-bold text-black dark:text-white mb-6">
            Puzzles
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl mx-auto">
            Challenge your mind with classic logic puzzles
          </p>
        </div>

        {/* Games List */}
        <div className="max-w-2xl mx-auto">
          <Link
            href="/games/sudoku"
            className="block border-t border-gray-300 dark:border-gray-700 py-8 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 flex items-center justify-center">
                  <Grid3x3 className="h-8 w-8 text-black dark:text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-bold text-black dark:text-white mb-1">
                    Sudoku
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Fill the grid with numbers 1-9
                  </p>
                </div>
              </div>
              <div className="text-2xl text-gray-400 dark:text-gray-600">
                →
              </div>
            </div>
          </Link>

          <div className="border-t border-b border-gray-300 dark:border-gray-700"></div>
        </div>
      </div>
    </div>
  );
}
