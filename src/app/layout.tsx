import { Inter } from '@next/font/google';
import LocalFont from '@next/font/local';
import { Metadata } from 'next';
import { Analytics } from '../components/analytics';

import '../global.css';

export const metadata: Metadata = {
  title: {
    default: 'zrosenbauer.com',
    template: '%s | zrosenbauer.com',
  },
  description: 'Co-founder of Joggr, coffee-fueled Node.js developer.',
  openGraph: {
    title: 'zrosenbauer.com',
    description:
      'Co-founder of Joggr, coffee-fueled Node.js developer, and DevOps know-it-all',
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
    title: 'Chronark',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      className={[inter.variable, calSans.variable].join(' ')}
    >
      <head>
        <Analytics />
      </head>
      <body
        className={`bg-black ${
          process.env.NODE_ENV === 'development' ? 'debug-screens' : undefined
        }`}
      >
        {children}
      </body>
    </html>
  );
}
