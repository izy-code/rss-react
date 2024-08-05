import '@/styles/global.scss';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';

import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { wrapper } from '@/store/store';

export default function App({ Component, pageProps }: AppProps): ReactNode {
  const { store } = wrapper.useWrappedStore(pageProps);

  return (
    <>
      <Head>
        <title>Rick and Morty characters</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Next.JS Pages Router educational project at the RS School" />
        <link rel="icon" type="image/svg+xml" href="/rick-favicon.svg" />
      </Head>
      <ErrorBoundary>
        <Provider store={store}>
          <ThemeProvider>
            <Component {...pageProps} />
          </ThemeProvider>
        </Provider>
      </ErrorBoundary>
    </>
  );
}
