import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { TRPCReactProvider } from '@/trpc/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sharing Is Caring - Find Your Event Roommate',
  description:
    'Find compatible roommates to share accommodation costs for festivals, conferences, concerts, and any event worldwide.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
