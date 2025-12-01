import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://gamesadfree.com"),
  title: {
    default: "Free Online Games - Play Sudoku, 2048, Minesweeper, Wordle | No Ads",
    template: "%s | GamesAdFree - Play Free Online Games",
  },
  description:
    "Play classic free online games without ads! Enjoy Sudoku puzzles, 2048 tile game, Minesweeper, and Wordle. No registration, no downloads, completely free browser games.",
  keywords: [
    "free online games",
    "games without ads",
    "sudoku online",
    "play 2048",
    "minesweeper game",
    "wordle online",
    "browser games",
    "free puzzle games",
    "word games",
    "no ads games",
    "online sudoku free",
    "free 2048 game",
    "minesweeper online free",
    "wordle free",
  ],
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
    title: "Free Online Games - Play Sudoku, 2048, Minesweeper, Wordle | No Ads",
    description:
      "Play classic free online games without ads! Enjoy Sudoku puzzles, 2048 tile game, Minesweeper, and Wordle.",
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
    title: "Free Online Games - Play Sudoku, 2048, Minesweeper, Wordle | No Ads",
    description:
      "Play classic free online games without ads! Enjoy Sudoku puzzles, 2048 tile game, Minesweeper, and Wordle.",
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
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
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
