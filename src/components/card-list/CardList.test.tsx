import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import * as api from '@/api/api';
import type { CharacterData } from '@/api/types';
import { charactersDataMock } from '@/test/mocks/mocks';
import { MOCK_PAGE_NUMBER, MOCK_SEARCH_NAME } from '@/test/msw/handlers';

import { CardList } from './CardList';

vi.mock('@/components/card/Card', (): { Card: React.FC<{ character: CharacterData }> } => ({
  Card: ({ character }: { character: CharacterData }) => <li>{character.name}</li>,
}));

vi.mock('@/components/loader/Loader', (): { Loader: React.FC } => ({
  Loader: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock('@/components/pagination/Pagination', (): { Pagination: React.FC<{ onPageChange: () => void }> } => ({
  Pagination: ({ onPageChange }: { onPageChange: () => void }) => <button onClick={onPageChange}>Pagination</button>,
}));

describe('CardList Component', () => {
  const fetchCharactersMock = vi.spyOn(api, 'fetchCharacters');

  afterEach((): void => {
    vi.clearAllMocks();
  });

  it('renders the specified number of cards', async (): Promise<void> => {
    render(
      <MemoryRouter initialEntries={[`/?page=${MOCK_PAGE_NUMBER}&name=${MOCK_SEARCH_NAME}`]}>
        <CardList searchTerm={MOCK_SEARCH_NAME} setIsLoading={() => {}} lastSearchTime={null} isLoading={false} />
      </MemoryRouter>,
    );

    expect(fetchCharactersMock).toHaveBeenCalled();

    const cards = await screen.findAllByRole('listitem');
    expect(cards).toHaveLength(charactersDataMock.info.count);
  });

  it('displays an appropriate message if no cards are present', async (): Promise<void> => {
    render(
      <MemoryRouter initialEntries={[`/?name=wrong`]}>
        <CardList searchTerm="" setIsLoading={() => {}} lastSearchTime={null} isLoading={false} />
      </MemoryRouter>,
    );

    expect(fetchCharactersMock).toHaveBeenCalled();

    const message = await screen.findByText('No characters found');
    expect(message).toBeInTheDocument();
  });
});
