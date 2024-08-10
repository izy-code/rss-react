import './root.scss';

import { isRouteErrorResponse, Links, Meta, Scripts, ScrollRestoration, useRouteError } from '@remix-run/react';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';

import { ClassErrorBoundary } from '@/components/error-boundary/ClassErrorBoundary';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ErrorPage } from '@/pages/error-page/ErrorPage';
import { MainPage } from '@/pages/main-page/MainPage';
import { Page404 } from '@/pages/page-404/Page404';
import { store } from '@/store/store';

export function Layout({ children }: { children: ReactNode }): ReactNode {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/rick-favicon.svg" />
        <title>Rick and Morty characters</title>
        <Meta />
        <Links />
      </head>
      <body className="root">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App(): ReactNode {
  return (
    <ThemeProvider>
      <ClassErrorBoundary>
        <Provider store={store}>
          <MainPage />
        </Provider>
      </ClassErrorBoundary>
    </ThemeProvider>
  );
}

export function ErrorBoundary(): ReactNode {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <ThemeProvider>
        <Page404 />
      </ThemeProvider>
    );
  }

  console.error('Error boundary caught error: ', error);

  return <ErrorPage errorBoundaryMessage={null} />;
}
