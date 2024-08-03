import type { AppProps } from 'next/app';
import Head from 'next/head';
import type { ReactNode } from 'react';

export default function App({ Component, pageProps }: AppProps): ReactNode {
  return (
    <>
      <Head>
        <title>Rick and Morty characters</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Next.JS Pages Router educational project at the RS School" />
        <link rel="icon" type="image/svg+xml" href="/rick-favicon.svg" />
      </Head>

      {/* <ErrorBoundary>
        {isLoading && <Loading />}
        <Provider store={store}> */}
      <Component {...pageProps} />
      {/* </Provider>
      </ErrorBoundary> */}
    </>
  );
}
