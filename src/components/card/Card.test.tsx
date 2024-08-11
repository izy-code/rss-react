import type { TypedResponse } from '@remix-run/node';
import type * as RemixReactType from '@remix-run/react';
import { json, useLoaderData, useLocation } from '@remix-run/react';
import { createRemixStub } from '@remix-run/testing';
import { screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import type { FetchCharacterListResult, FetchCharacterResult } from '@/api/api';
import App from '@/app/root';
import Index from '@/app/routes/_index';
import { SearchParams } from '@/common/enums';
import { characterMock, charactersDataMock } from '@/test/mocks/mocks';
import { renderWithProvidersAndUser } from '@/utils/test-utils';

import { CardList } from '../card-list/CardList';
import { Card } from './Card';

const DETAILS_TEST_ID = 'details-display';

global.URL.createObjectURL = vi.fn(() => 'mockedURL');

function DetailsSearchParamDisplay(): ReactNode {
  const location = useLocation();
  const detailsID = new URLSearchParams(location.search).get(SearchParams.DETAILS);

  return <p data-testid={DETAILS_TEST_ID}>{detailsID}</p>;
}

describe('Card Component', () => {
  afterAll(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the relevant card data', (): void => {
    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: (): ReactNode => <Card character={characterMock} />,
      },
    ]);

    renderWithProvidersAndUser(<RemixStub />);

    expect(screen.getByRole('heading', { name: characterMock.name })).toBeInTheDocument();
    expect(screen.getByAltText(characterMock.name)).toHaveAttribute('src', characterMock.image);
  });

  it('changes URL search params when clicked which triggers an additional API call', async (): Promise<void> => {
    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: (): ReactNode => (
          <>
            <Card character={characterMock} />
            <DetailsSearchParamDisplay />
          </>
        ),
      },
    ]);

    const { user } = renderWithProvidersAndUser(<RemixStub />);

    const linkElement = screen.getByRole('link');

    expect(linkElement).toBeInTheDocument();

    await user.click(linkElement);

    expect(screen.getByTestId(DETAILS_TEST_ID)).toHaveTextContent(characterMock.id.toString());
  });

  it('triggers an additional API call to fetch detailed information when clicked', async (): Promise<void> => {
    vi.mock('@remix-run/react', async () => {
      const original = await vi.importActual<typeof RemixReactType>('@remix-run/react');
      return {
        ...original,
        useLoaderData: vi.fn(original.useLoaderData),
      };
    });

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
      />,
    );

    const useLoaderDataSpy = vi.mocked(useLoaderData);
    const initialCallCount = useLoaderDataSpy.mock.calls.length;

    const linkElements = screen.getAllByRole('link');

    await user.click(linkElements[0]!);

    const afterClickCallCount = useLoaderDataSpy.mock.calls.length;

    expect(afterClickCallCount).toBeGreaterThan(initialCallCount);
  });

  it('triggers flyout counter change when input clicked', async (): Promise<void> => {
    const RemixStub = createRemixStub([
      {
        path: `/`,
        Component: (): ReactNode => <CardList characters={{ status: 'success', data: charactersDataMock }} />,
      },
    ]);

    const { user } = renderWithProvidersAndUser(<RemixStub />);

    const checkboxes = await screen.findAllByRole('checkbox');
    const counter = screen.getByText(/items selected: 0/i);

    if (!checkboxes[0]) {
      return;
    }

    await user.click(checkboxes[0]);
    await waitFor(() => expect(counter).toHaveTextContent(/items selected: 1/i));

    await user.click(checkboxes[0]);
    await waitFor(() => expect(counter).toHaveTextContent(/items selected: 0/i));
  });
});
