import type { Metadata } from "next";
import { allGames } from "./games";

// Generate dynamic keywords from all games
const baseKeywords = [
  "free online games",
  "games without ads",
  "browser games",
  "free puzzle games",
  "word games",
  "no ads games",
];

const dynamicGameKeywords = allGames.flatMap((game) => [
  game.name.toLowerCase(),
  `${game.name.toLowerCase()} online`,
  `free ${game.name.toLowerCase()}`,
  `play ${game.name.toLowerCase()}`,
]);

// Generate dynamic title using first few game names
const featuredGames = allGames.slice(0, 3).map((g) => g.name).join(", ");

// Generate dynamic description
const gameList = allGames.slice(0, 4).map((g) => g.name).join(", ");

export const metadata: Metadata = {
  metadataBase: new URL("https://gamesadfree.com"),
  title: {
    default: `Free Online Games | ${featuredGames} | No Ads`,
    template: "%s | GamesAdFree - Play Free Online Games",
  },
  description: `Play classic free online games without ads! Enjoy ${gameList}, and more. No registration, no downloads, completely free browser games.`,
  keywords: [...baseKeywords, ...dynamicGameKeywords],
  authors: [{ name: "GamesAdFree" }],
  creator: "GamesAdFree",
  publisher: "GamesAdFree",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gamesadfree.com",
    siteName: "GamesAdFree",
    title: `Free Online Games | ${featuredGames} | No Ads`,
    description: `Play classic free online games without ads! Enjoy ${gameList}, and more.`,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GamesAdFree - Free Online Games",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Free Online Games | ${featuredGames} | No Ads`,
    description: `Play classic free online games without ads! Enjoy ${gameList}, and more.`,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
  alternates: {
    canonical: "https://gamesadfree.com",
  },
  verification: {
    // Add your verification codes here when you set them up
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};
