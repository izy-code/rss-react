import '@testing-library/jest-dom';

import { screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createMemoryRouter, MemoryRouter, RouterProvider, useLocation } from 'react-router-dom';

import { SearchParams } from '@/common/enums';
import { Details } from '@/components/details/Details';
import { routes } from '@/router/routes';
import { BASE_URL } from '@/store/api/api-slice';
import { characterMock } from '@/test/mocks/mocks';
import { MOCK_SEARCH_NAME } from '@/test/msw/handlers';
import { renderWithProvidersAndUser } from '@/utils/test-utils';

import { Card } from './Card';

const DETAILS_TEST_ID = 'details-display';

global.URL.createObjectURL = vi.fn(() => 'mockedURL');

function DetailsSearchParamDisplay(): ReactNode {
  const location = useLocation();
  const detailsID = new URLSearchParams(location.search).get(SearchParams.DETAILS);

  return <p data-testid={DETAILS_TEST_ID}>{detailsID}</p>;
}

describe('Card Component', () => {
  it('renders the relevant card data', (): void => {
    renderWithProvidersAndUser(
      <MemoryRouter>
        <Card character={characterMock} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: characterMock.name })).toBeInTheDocument();
    expect(screen.getByAltText(characterMock.name)).toHaveAttribute('src', characterMock.image);
  });

  it('changes URL search params when clicked', async (): Promise<void> => {
    const { user } = renderWithProvidersAndUser(
      <MemoryRouter>
        <Card character={characterMock} />
        <DetailsSearchParamDisplay />
      </MemoryRouter>,
    );

    const linkElement = screen.getByRole('link');

    expect(linkElement).toBeInTheDocument();

    await user.click(linkElement);

    expect(screen.getByTestId(DETAILS_TEST_ID)).toHaveTextContent(characterMock.id.toString());
  });

  it('triggers an additional API call to fetch detailed information when clicked', async (): Promise<void> => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const { user } = renderWithProvidersAndUser(
      <MemoryRouter initialEntries={[`/`]}>
        <Card character={characterMock} />
        <Details />
      </MemoryRouter>,
    );

    const linkElement = screen.getByRole('link');

    expect(fetchSpy).not.toHaveBeenCalled();

    await user.click(linkElement);
    await waitFor(() =>
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.objectContaining({ url: `${BASE_URL}character/${characterMock.id}` }),
      ),
    );

    expect(fetchSpy).toHaveBeenCalled();
  });

  it('triggers flyout counter change when input clicked', async (): Promise<void> => {
    const router = createMemoryRouter(routes, {
      initialEntries: [`/?${SearchParams.NAME}=${MOCK_SEARCH_NAME}`],
    });
    const { user } = renderWithProvidersAndUser(<RouterProvider router={router} />);

    const checkboxes = await screen.findAllByRole('checkbox');
    const counter = screen.getByText(/items selected: 0/i);

    if (!checkboxes[0]) {
      return;
    }

    await user.click(checkboxes[0]);

    await waitFor(() => expect(counter).toHaveTextContent(/items selected: 1/i));
  });
});
