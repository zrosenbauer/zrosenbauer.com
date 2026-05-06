import { GeistMono } from 'geist/font/mono';
import { GeistPixelSquare } from 'geist/font/pixel';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import LocalFont from 'next/font/local';

import { Analytics } from '../components/analytics';

import 'remark-github-blockquote-alert/alert.css';
import '../global.css';

export const metadata: Metadata = {
  title: {
    default: 'zrosenbauer.com',
    template: '%s | zrosenbauer.com',
  },
  description:
    'Co-founder of Joggr — the developer toolkit for building with AI agents. TypeScript, Node, Rust, and a purveyor of all languages.',
  openGraph: {
    title: 'zrosenbauer.com',
    description:
      'Co-founder of Joggr — the developer toolkit for building with AI agents. TypeScript, Node, Rust, and a purveyor of all languages.',
    url: 'https://zrosenbauer.com',
    siteName: 'zrosenbauer.com',
    images: [
      {
        url: 'https://zrosenbauer.com/logo.png',
        width: 1920,
        height: 1080,
      },
    ],
    locale: 'en-US',
    type: 'website',
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
  twitter: {
    title: 'zrosenbauer.com',
    card: 'summary_large_image',
  },
  icons: {
    shortcut: '/favicon.png',
  },
};
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const calSans = LocalFont({
  src: '../../public/fonts/CalSans-SemiBold.ttf',
  variable: '--font-calsans',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={[
        inter.variable,
        calSans.variable,
        GeistMono.variable,
        GeistPixelSquare.variable,
      ].join(' ')}
    >
      <head>
        <Analytics />
      </head>
      <body className="bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
