import Link from "next/link";
import { allGames } from "./games";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GamesAdFree",
    url: "https://gamesadfree.com",
    description:
      "Free online games without ads - Play Sudoku, 2048, Minesweeper, Wordle, Hangman, Tic Tac Toe, Snake, Memory, and Word Search",
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
    itemListElement: allGames.map((game, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Game",
        name: game.name,
        url: `https://gamesadfree.com/games/${game.slug}`,
        description: game.longDescription,
        genre: game.genre,
        gamePlatform: "Web browser",
      },
    })),
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
            {allGames.map((game) => {
              const Icon = game.icon;
              return (
                <Link
                  key={game.slug}
                  href={game.href}
                  className="group border border-gray-300 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 flex items-center justify-center mb-4">
                      <Icon className="h-10 w-10 text-black dark:text-white group-hover:scale-110 transition-transform" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-black dark:text-white mb-2">
                      {game.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {game.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
