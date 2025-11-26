import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  metadataBase: new URL('https://gamesadfree.com'),
  title: {
    default: 'Free Online Games - Play Sudoku, 2048, Minesweeper | No Ads',
    template: '%s | GamesAdFree - Play Free Online Games'
  },
  description: 'Play classic free online games without ads! Enjoy Sudoku puzzles, 2048 tile game, and Minesweeper. No registration, no downloads, completely free browser games.',
  keywords: ['free online games', 'games without ads', 'sudoku online', 'play 2048', 'minesweeper game', 'browser games', 'free puzzle games', 'no ads games', 'online sudoku free', 'free 2048 game', 'minesweeper online free'],
  authors: [{ name: 'GamesAdFree' }],
  creator: 'GamesAdFree',
  publisher: 'GamesAdFree',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gamesadfree.com',
    siteName: 'GamesAdFree',
    title: 'Free Online Games - Play Sudoku, 2048, Minesweeper | No Ads',
    description: 'Play classic free online games without ads! Enjoy Sudoku puzzles, 2048 tile game, and Minesweeper.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GamesAdFree - Free Online Games',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Games - Play Sudoku, 2048, Minesweeper | No Ads',
    description: 'Play classic free online games without ads! Enjoy Sudoku puzzles, 2048 tile game, and Minesweeper.',
    images: ['/og-image.png'],
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
  verification: {
    // Add your verification codes here when you set them up
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
