import type { Metadata } from 'next';

export interface GameMetadataOptions {
  title: string;
  description: string;
  keywords: string[];
  gamePath: string; // e.g., '/games/2048'
  ogImage: string; // e.g., '/og-2048.png'
  structuredData: {
    name: string;
    alternateName: string;
    description: string;
    genre: string[];
    featureList: string[];
    ratingValue?: string;
    ratingCount?: string;
  };
}

export function createGameMetadata(options: GameMetadataOptions): Metadata {
  const { title, description, keywords, gamePath, ogImage, structuredData } = options;
  const fullUrl = `https://gamesadfree.com${gamePath}`;
  const ogImageUrl = ogImage.startsWith('http') ? ogImage : `https://gamesadfree.com${ogImage}`;

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'GamesAdFree' }],
    creator: 'GamesAdFree',
    publisher: 'GamesAdFree',
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: 'GamesAdFree',
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Free Online ${title.replace('Play ', '').split(' - ')[0]} Game - No Ads`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description.split('.')[0] + '.',
      images: [ogImageUrl],
      creator: '@gamesadfree',
    },
    alternates: {
      canonical: fullUrl,
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
}

export function createGameStructuredData(
  options: GameMetadataOptions
): Record<string, unknown> {
  const { gamePath, structuredData } = options;
  const fullUrl = `https://gamesadfree.com${gamePath}`;

  const result: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Game',
    name: structuredData.name,
    alternateName: structuredData.alternateName,
    url: fullUrl,
    description: structuredData.description,
    genre: structuredData.genre,
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
    featureList: structuredData.featureList,
    inLanguage: 'en',
    isAccessibleForFree: true,
    publisher: {
      '@type': 'Organization',
      name: 'GamesAdFree',
      url: 'https://gamesadfree.com',
    },
  };

  if (structuredData.ratingValue && structuredData.ratingCount) {
    result.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: structuredData.ratingValue,
      ratingCount: structuredData.ratingCount,
      bestRating: '5',
      worstRating: '1',
    };
  }

  return result;
}

