import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchCharacters } from '@/api/api';
import type { CharacterData, CharacterListInfo } from '@/api/types';

import { CardList } from './CardList';

vi.mock('@/api/api', () => ({
  fetchCharacters: vi.fn(),
  DEFAULT_PAGE: 1,
}));

vi.mock('@/components/card/Card', (): { Card: React.FC<{ character: CharacterData }> } => ({
  Card: ({ character }: { character: CharacterData }) => <div data-testid="card">{character.name}</div>,
}));

vi.mock('@/components/loader/Loader', (): { Loader: React.FC } => ({
  Loader: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock('../pagination/Pagination', (): { Pagination: React.FC<{ onPageChange: () => void }> } => ({
  Pagination: ({ onPageChange }: { onPageChange: () => void }) => <button onClick={onPageChange}>Pagination</button>,
}));

describe('CardList Component', () => {
  const fetchCharactersMock = vi.mocked(fetchCharacters);

  afterEach((): void => {
    vi.clearAllMocks();
  });

  it('renders the specified number of cards (20)', async (): Promise<void> => {
    const mockCharacters: CharacterData[] = Array.from(
      { length: 20 },
      (_, i) =>
        ({
          id: i,
          name: `Character ${i}`,
        }) as CharacterData,
    );
    fetchCharactersMock.mockResolvedValue({
      status: 'success',
      data: { results: mockCharacters, info: { count: 20, pages: 1, next: null, prev: null } as CharacterListInfo },
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <CardList searchTerm="" setIsLoading={() => {}} lastSearchTime={null} isLoading={false} />
      </MemoryRouter>,
    );

    expect(fetchCharactersMock).toHaveBeenCalled();

    const cards = await screen.findAllByTestId('card');
    expect(cards).toHaveLength(20);
  });

  it('displays an appropriate message if no cards are present', async (): Promise<void> => {
    fetchCharactersMock.mockResolvedValue({
      status: 'empty',
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <CardList searchTerm="" setIsLoading={() => {}} lastSearchTime={null} isLoading={false} />
      </MemoryRouter>,
    );

    expect(fetchCharactersMock).toHaveBeenCalled();

    const message = await screen.findByText('No characters found');
    expect(message).toBeInTheDocument();
  });
});
