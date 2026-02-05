import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { IBM_Plex_Sans_Condensed, Roboto } from 'next/font/google';
import { Providers } from './providers';
import MixpanelInit from '@/components/MixpanelInit';
import UserInfoModal from '@/components/UserInfoModal';
import '@/lib/env'; // Validate environment variables at startup
import './globals.css';

const ibmPlexSansCondensed = IBM_Plex_Sans_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Claude Bootstrap',
  description: 'A turborepo monorepo starter with Next.js and Express',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): ReactNode {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${ibmPlexSansCondensed.variable} ${roboto.variable} font-body`}
        suppressHydrationWarning
      >
        <MixpanelInit />
        <Providers>{children}</Providers>
        <UserInfoModal />
      </body>
    </html>
  );
}
