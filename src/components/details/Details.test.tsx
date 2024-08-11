import type { TypedResponse } from '@remix-run/node';
import { json } from '@remix-run/react';
import { createRemixStub } from '@remix-run/testing';
import { screen } from '@testing-library/react';
import type { ReactNode } from 'react';

import type { FetchCharacterListResult, FetchCharacterResult } from '@/api/api';
import App from '@/app/root';
import Index from '@/app/routes/_index';
import { SearchParams } from '@/common/enums';
import { characterMock, charactersDataMock } from '@/test/mocks/mocks';
import { renderWithProvidersAndUser } from '@/utils/test-utils';

import { Details } from './Details';

describe('Details Component', () => {
  afterAll(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('displays a loading indicator while fetching data', async () => {
    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: (): ReactNode => <Index />,
      },
    ]);

    renderWithProvidersAndUser(<RemixStub />);

    expect(await screen.findByRole('heading', { name: /loading.../i })).toBeInTheDocument();
  });

  it('displays the detailed card data correctly', async () => {
    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: (): ReactNode => <Details character={{ status: 'success', data: characterMock }} />,
      },
    ]);

    renderWithProvidersAndUser(<RemixStub initialEntries={[`/?${SearchParams.DETAILS}=${characterMock.id}`]} />);

    expect(await screen.findByText(characterMock.name)).toBeInTheDocument();
    expect(screen.getByText(characterMock.species)).toBeInTheDocument();
    expect(screen.getByText(characterMock.status)).toBeInTheDocument();
    expect(screen.getByText(characterMock.gender)).toBeInTheDocument();
  });

  it('hides the details section when the close button is clicked', async () => {
    const RemixStub = createRemixStub([
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

    const { user } = renderWithProvidersAndUser(
      <RemixStub
        hydrationData={{
          loaderData: {
            root: { status: 'success', data: charactersDataMock },
            index: { status: 'success', data: characterMock },
          },
        }}
        initialEntries={[`/?${SearchParams.DETAILS}=${characterMock.id}`]}
      />,
    );

    const closeButton = await screen.findByRole('button', { name: /close details/i });

    expect(closeButton).toBeInTheDocument();

    await user.click(closeButton);
    expect(screen.queryByRole('button', { name: /close details/i })).not.toBeInTheDocument();
  });
});
