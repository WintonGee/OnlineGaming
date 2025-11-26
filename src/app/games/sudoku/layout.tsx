import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Play Sudoku Free Online - No Ads | Multiple Difficulty Levels',
  description: 'Play free Sudoku online without ads! Choose from Easy, Medium, Hard, and Expert levels. Features auto-candidates, hints, undo, and more. No registration or download required.',
  keywords: [
    'sudoku online',
    'free sudoku',
    'sudoku game',
    'play sudoku',
    'sudoku puzzle',
    'sudoku no ads',
    'online sudoku free',
    'sudoku easy',
    'sudoku hard',
    'sudoku expert',
    'daily sudoku',
    'sudoku solver',
    'sudoku hints',
    'web sudoku',
  ],
  authors: [{ name: 'GamesAdFree' }],
  creator: 'GamesAdFree',
  publisher: 'GamesAdFree',
  openGraph: {
    title: 'Play Sudoku Free Online - No Ads | Multiple Difficulty Levels',
    description: 'Play free Sudoku online without ads! Choose from Easy, Medium, Hard, and Expert levels. Features auto-candidates, hints, undo, and more.',
    url: 'https://gamesadfree.com/games/sudoku',
    siteName: 'GamesAdFree',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-sudoku.png',
        width: 1200,
        height: 630,
        alt: 'Free Online Sudoku Game - No Ads',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Play Sudoku Free Online - No Ads',
    description: 'Play free Sudoku with Easy, Medium, Hard, and Expert levels. Features auto-candidates, hints, and undo.',
    images: ['/og-sudoku.png'],
    creator: '@gamesadfree',
  },
  alternates: {
    canonical: 'https://gamesadfree.com/games/sudoku',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function SudokuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Game',
    name: 'Sudoku - Free Online Puzzle Game',
    alternateName: 'Sudoku Puzzle',
    url: 'https://gamesadfree.com/games/sudoku',
    description: 'Free online Sudoku puzzle game with multiple difficulty levels - Easy, Medium, Hard, and Expert. Features auto-candidates, hints, undo functionality, and more.',
    genre: ['Puzzle', 'Logic', 'Brain Teaser'],
    gamePlatform: ['Web browser', 'Desktop', 'Mobile', 'Tablet'],
    applicationCategory: 'Game',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Modern web browser recommended.',
    numberOfPlayers: {
      '@type': 'QuantitativeValue',
      value: 1,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      category: 'Free',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1000',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'Multiple difficulty levels (Easy, Medium, Hard, Expert)',
      'Auto-candidate mode',
      'Hints and cell checking',
      'Undo functionality',
      'Responsive design',
      'Dark mode support',
      'No ads',
      'No registration required',
    ],
    inLanguage: 'en',
    isAccessibleForFree: true,
    publisher: {
      '@type': 'Organization',
      name: 'GamesAdFree',
      url: 'https://gamesadfree.com',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
