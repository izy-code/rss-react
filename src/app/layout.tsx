import './global.scss';

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';
import { ThemeProvider } from '@/contexts/ThemeContext';
import StoreProvider from '@/store/store-provider';

export const metadata: Metadata = {
  title: 'Rick and Morty characters',
  description: 'Next.JS App Router educational project at RS School',
};

export default function RootLayout({ children }: { children: ReactNode }): ReactNode {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <StoreProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </StoreProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
