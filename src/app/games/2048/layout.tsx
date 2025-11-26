import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Play 2048 Game Free Online - No Ads | Classic Tile Puzzle',
  description: 'Play the addictive 2048 tile puzzle game free online without ads! Slide tiles to combine numbers and reach 2048. Smooth animations, responsive design. No downloads required.',
  keywords: [
    '2048 game',
    'play 2048',
    '2048 online',
    'free 2048',
    '2048 puzzle',
    '2048 no ads',
    'tile game',
    'number puzzle',
    '2048 browser game',
    'classic 2048',
    '2048 online free',
    'sliding puzzle',
    'number game',
  ],
  authors: [{ name: 'GamesAdFree' }],
  creator: 'GamesAdFree',
  publisher: 'GamesAdFree',
  openGraph: {
    title: 'Play 2048 Game Free Online - No Ads | Classic Tile Puzzle',
    description: 'Play the addictive 2048 tile puzzle game free online without ads! Slide tiles to combine numbers and reach 2048. Smooth animations, responsive design.',
    url: 'https://gamesadfree.com/games/2048',
    siteName: 'GamesAdFree',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-2048.png',
        width: 1200,
        height: 630,
        alt: 'Free Online 2048 Game - No Ads',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Play 2048 Game Free Online - No Ads',
    description: 'Addictive 2048 tile puzzle game. Slide tiles to combine numbers and reach 2048!',
    images: ['/og-2048.png'],
    creator: '@gamesadfree',
  },
  alternates: {
    canonical: 'https://gamesadfree.com/games/2048',
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

export default function Game2048Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Game',
    name: '2048 - Free Online Tile Puzzle Game',
    alternateName: '2048 Game',
    url: 'https://gamesadfree.com/games/2048',
    description: 'Classic 2048 tile sliding puzzle game - combine tiles with the same number to reach 2048. Addictive gameplay with smooth animations and responsive design.',
    genre: ['Puzzle', 'Tile Matching', 'Strategy'],
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
      ratingValue: '4.7',
      ratingCount: '850',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'Classic 2048 gameplay',
      'Smooth tile animations',
      'Score tracking and best score',
      'Responsive design for all devices',
      'Keyboard and swipe controls',
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
