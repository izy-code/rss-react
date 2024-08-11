import './root.scss';

import type { LoaderFunctionArgs } from '@remix-run/node';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';

import type { FetchCharacterListResult } from '@/api/api';
import { DEFAULT_PAGE, fetchCharacters } from '@/api/api';
import { SearchParams } from '@/common/enums';
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

export const loader = async ({ request }: LoaderFunctionArgs): Promise<FetchCharacterListResult> => {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get(SearchParams.NAME) || '';
  const page = Number(url.searchParams.get(SearchParams.PAGE)) || DEFAULT_PAGE;

  const characters = await fetchCharacters(searchTerm, page);

  return characters;
};

export default function App(): ReactNode {
  const characters = useLoaderData<typeof loader>();

  return (
    <ThemeProvider>
      <ClassErrorBoundary>
        <Provider store={store}>
          <MainPage characters={characters} />
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
