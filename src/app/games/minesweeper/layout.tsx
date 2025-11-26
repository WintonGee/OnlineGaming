import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Play Minesweeper Free Online - No Ads | Classic Game',
  description: 'Play classic Minesweeper game free online without ads! Choose from Easy, Medium, Hard difficulty or create custom boards. Track your best times. No downloads required.',
  keywords: [
    'minesweeper online',
    'play minesweeper',
    'free minesweeper',
    'minesweeper game',
    'minesweeper no ads',
    'classic minesweeper',
    'minesweeper browser',
    'windows minesweeper',
    'minesweeper puzzle',
    'minesweeper online free',
    'mine sweeper',
    'minesweeper classic game',
  ],
  authors: [{ name: 'GamesAdFree' }],
  creator: 'GamesAdFree',
  publisher: 'GamesAdFree',
  openGraph: {
    title: 'Play Minesweeper Free Online - No Ads | Classic Game',
    description: 'Play classic Minesweeper game free online without ads! Choose from Easy, Medium, Hard difficulty or create custom boards. Track your best times.',
    url: 'https://gamesadfree.com/games/minesweeper',
    siteName: 'GamesAdFree',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-minesweeper.png',
        width: 1200,
        height: 630,
        alt: 'Free Online Minesweeper Game - No Ads',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Play Minesweeper Free Online - No Ads',
    description: 'Classic Minesweeper with Easy, Medium, Hard levels and custom boards. Track your best times!',
    images: ['/og-minesweeper.png'],
    creator: '@gamesadfree',
  },
  alternates: {
    canonical: 'https://gamesadfree.com/games/minesweeper',
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

export default function MinesweeperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Game',
    name: 'Minesweeper - Free Online Classic Game',
    alternateName: 'Mine Sweeper',
    url: 'https://gamesadfree.com/games/minesweeper',
    description: 'Classic Minesweeper game with customizable difficulty levels - Easy, Medium, Hard, and Custom. Clear the board without hitting mines and track your best times.',
    genre: ['Puzzle', 'Logic', 'Strategy'],
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
      ratingValue: '4.6',
      ratingCount: '750',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'Classic Windows-style Minesweeper',
      'Multiple difficulty levels (Easy, Medium, Hard)',
      'Custom board settings',
      'Best time tracking',
      'Classic graphics and animations',
      'Responsive design for all devices',
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
