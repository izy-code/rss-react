import { screen, waitFor } from '@testing-library/react';
import mockRouter from 'next-router-mock';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';

import { SearchParams } from '@/common/enums';
import Home from '@/pages';
import { BASE_URL } from '@/store/api/api-slice';
import { characterMock } from '@/test/mocks/mocks';
import { MOCK_SEARCH_NAME } from '@/test/msw/handlers';
import { renderWithProvidersAndUser } from '@/utils/test-utils';

import { Details } from '../details/Details';
import { Card } from './Card';

describe('Card Component', () => {
  afterEach((): void => {
    vi.clearAllMocks();
  });

  it('renders the relevant card data', (): void => {
    renderWithProvidersAndUser(
      <MemoryRouterProvider>
        <Card character={characterMock} />
      </MemoryRouterProvider>,
    );

    expect(screen.getByRole('heading', { name: characterMock.name })).toBeInTheDocument();
    expect(screen.getByAltText(characterMock.name)).toBeInTheDocument();
  });

  it('changes URL search params when clicked', async (): Promise<void> => {
    vi.mock('next/router', () => vi.importActual('next-router-mock'));

    const { user } = renderWithProvidersAndUser(
      <MemoryRouterProvider>
        <Card character={characterMock} />
      </MemoryRouterProvider>,
    );

    const linkElement = screen.getByRole('link');

    expect(linkElement).toHaveAttribute('href', `/?${SearchParams.DETAILS}=${characterMock.id}`);

    await user.click(linkElement);

    expect(mockRouter).toMatchObject({
      query: { [SearchParams.DETAILS]: characterMock.id.toString() },
    });
  });

  it('validates that clicking on a card opens a detailed card component', async (): Promise<void> => {
    vi.mock('next/router', () => vi.importActual('next-router-mock'));

    const { user } = renderWithProvidersAndUser(
      <MemoryRouterProvider url={`/?${SearchParams.NAME}=${MOCK_SEARCH_NAME}`}>
        <Home />
      </MemoryRouterProvider>,
    );
    expect(screen.queryByRole('button', { name: /close details/i })).not.toBeInTheDocument();

    const linkElements = await screen.findAllByRole('link');

    await user.click(linkElements[0]!);

    expect(await screen.findByRole('button', { name: /close details/i })).toBeInTheDocument();
  });

  it('triggers an additional API call to fetch detailed information when clicked', async (): Promise<void> => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const { user } = renderWithProvidersAndUser(
      <MemoryRouterProvider>
        <Card character={characterMock} />
        <Details />
      </MemoryRouterProvider>,
    );

    const linkElement = screen.getByRole('link');

    expect(fetchSpy).not.toHaveBeenCalled();

    await user.click(linkElement);

    await waitFor(() =>
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.objectContaining({ url: `${BASE_URL}character/${characterMock.id}` }),
      ),
    );
  });

  it('triggers flyout counter change when input clicked', async (): Promise<void> => {
    global.URL.createObjectURL = vi.fn(() => 'mockedURL');

    const { user } = renderWithProvidersAndUser(
      <MemoryRouterProvider url={`/?${SearchParams.NAME}=${MOCK_SEARCH_NAME}`}>
        <Home />
      </MemoryRouterProvider>,
    );

    const checkboxes = await screen.findAllByRole('checkbox');
    const counter = screen.getByText(/items selected: 0/i);

    await user.click(checkboxes[0]!);
    await waitFor(() => expect(counter).toHaveTextContent(/items selected: 1/i));

    await user.click(checkboxes[0]!);
    await waitFor(() => expect(counter).toHaveTextContent(/items selected: 0/i));
  });
});
