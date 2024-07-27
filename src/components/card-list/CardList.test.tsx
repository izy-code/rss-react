import '@testing-library/jest-dom';

import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { charactersDataMock } from '@/test/mocks/mocks';
import { MOCK_PAGE_NUMBER, MOCK_SEARCH_NAME } from '@/test/msw/handlers';
import { renderWithProvidersAndUser } from '@/utils/test-utils';

import { CardList } from './CardList';

describe('CardList Component', () => {
  afterEach((): void => {
    vi.clearAllMocks();
  });

  it('renders the specified number of cards', async (): Promise<void> => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    renderWithProvidersAndUser(
      <MemoryRouter initialEntries={[`/?page=${MOCK_PAGE_NUMBER}&name=${MOCK_SEARCH_NAME}`]}>
        <CardList />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalled();
    });
    const cards = await screen.findAllByRole('listitem');
    expect(cards).toHaveLength(charactersDataMock.info.count);
  });

  it('displays an appropriate message if no cards are present', async (): Promise<void> => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    renderWithProvidersAndUser(
      <MemoryRouter initialEntries={[`/?name=wrong`]}>
        <CardList />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalled();
    });

    const message = await screen.findByText('No characters found');
    expect(message).toBeInTheDocument();
  });
});
