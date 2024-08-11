import type { TypedResponse } from '@remix-run/node';
import { json } from '@remix-run/node';
import { createRemixStub } from '@remix-run/testing';
import { screen } from '@testing-library/react';
import type { ReactNode } from 'react';

import type { FetchCharacterListResult, FetchCharacterResult } from '@/api/api';
import App from '@/app/root';
import Index from '@/app/routes/_index';
import { SearchParams } from '@/common/enums';
import { Page404 } from '@/pages/page-404/Page404';
import { characterMock, charactersDataMock } from '@/test/mocks/mocks';
import { renderWithProvidersAndUser } from '@/utils/test-utils';

const AppRemixStub = createRemixStub([
  {
    id: 'root',
    path: '/',
    Component: (): ReactNode => <App />,
    children: [
      {
        id: 'index',
        path: '/',
        Component: (): ReactNode => <Index />,
        loader: (): TypedResponse<FetchCharacterResult> => json({ status: 'success', data: characterMock }),
      },
    ],
    loader: (): TypedResponse<FetchCharacterListResult> => json({ status: 'success', data: charactersDataMock }),
  },
]);

describe('Router render', () => {
  it('should match the snapshot for main route', async () => {
    const { container } = renderWithProvidersAndUser(
      <AppRemixStub
        hydrationData={{
          loaderData: {
            root: { status: 'success', data: charactersDataMock },
            index: { status: 'success', data: characterMock },
          },
        }}
        initialEntries={[`/?${SearchParams.DETAILS}=${characterMock.id}`]}
      />,
    );

    await screen.findByRole('button', { name: /prev/i });

    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot for 404 page', () => {
    const RemixStub404 = createRemixStub([
      {
        path: '/',
        Component: (): ReactNode => <Page404 />,
      },
    ]);

    const { container } = renderWithProvidersAndUser(<RemixStub404 />);

    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot for error page', async () => {
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { container, user } = renderWithProvidersAndUser(
      <AppRemixStub
        hydrationData={{
          loaderData: {
            root: { status: 'success', data: charactersDataMock },
            index: { status: 'success', data: characterMock },
          },
        }}
        initialEntries={[`/?${SearchParams.DETAILS}=${characterMock.id}`]}
      />,
    );

    const errorButton = screen.getByRole('button', { name: /throw error/i });

    await user.click(errorButton);

    expect(consoleErrorMock).toHaveBeenCalled();
    expect(container).toMatchSnapshot();
  });
});
