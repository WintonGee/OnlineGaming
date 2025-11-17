import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Grid3x3, Crown, Type, Sparkles } from 'lucide-react';

export default function Home() {
  const games = [
    {
      title: 'Sudoku',
      description: 'Classic number puzzle game. Fill the 9×9 grid with numbers 1-9.',
      href: '/games/sudoku',
      icon: Grid3x3,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      available: true,
    },
    {
      title: 'Chess',
      description: 'Strategic board game. Challenge yourself or play against AI.',
      href: '/games/chess',
      icon: Crown,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      available: false,
    },
    {
      title: 'Wordle',
      description: 'Guess the five-letter word in six tries or less.',
      href: '/games/wordle',
      icon: Type,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900',
      available: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-12 w-12 text-yellow-500" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Free Fun Games
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Challenge your mind with our collection of classic games. No registration required, completely free!
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {games.map((game) => {
            const Icon = game.icon;
            const cardContent = (
              <Card
                className={`h-full transition-all duration-300 ${
                  game.available
                    ? 'hover:shadow-xl hover:scale-105 cursor-pointer'
                    : 'opacity-60 cursor-not-allowed'
                }`}
              >
                <CardHeader>
                  <div className={`${game.bgColor} w-16 h-16 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`h-8 w-8 ${game.color}`} />
                  </div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    {game.title}
                    {!game.available && (
                      <span className="text-xs font-normal bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                        Coming Soon
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {game.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {game.available ? (
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      Play Now →
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Stay tuned!
                    </p>
                  )}
                </CardContent>
              </Card>
            );

            return game.available ? (
              <Link key={game.title} href={game.href}>
                {cardContent}
              </Link>
            ) : (
              <div key={game.title}>{cardContent}</div>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Why Play Here?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="text-4xl mb-2">🎮</div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                Completely Free
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                All games are free to play with no hidden costs or subscriptions
              </p>
            </div>
            <div>
              <div className="text-4xl mb-2">🚀</div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                No Registration
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Jump right in and start playing without creating an account
              </p>
            </div>
            <div>
              <div className="text-4xl mb-2">📱</div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                Mobile Friendly
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Play on any device - desktop, tablet, or smartphone
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
