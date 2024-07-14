import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchCharacters } from '@/api/api';
import type { Character, Info } from '@/api/types';

import { CardList } from './CardList';

vi.mock('@/api/api', () => ({
  fetchCharacters: vi.fn(),
  DEFAULT_PAGE: 1,
}));

vi.mock('@/components/card/Card', (): { Card: React.FC<{ character: Character }> } => ({
  Card: ({ character }: { character: Character }) => <div data-testid="card">{character.name}</div>,
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
    const mockCharacters: Character[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      name: `Character ${i}`,
      status: 'Alive',
      species: 'Human',
      type: 'Human',
      gender: 'Male',
      origin: {
        name: 'Earth (C-137)',
        url: 'https://rickandmortyapi.com/api/location/1',
      },
      location: {
        name: 'Earth (Replacement Dimension)',
        url: 'https://rickandmortyapi.com/api/location/20',
      },
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      episode: ['https://rickandmortyapi.com/api/episode/1'],
      created: '2017-11-04T18:48:46.250Z',
      url: 'https://rickandmortyapi.com/api/character/1',
    }));
    fetchCharactersMock.mockResolvedValue({
      results: mockCharacters,
      info: { count: 20, pages: 1, next: null, prev: null } as Info,
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <CardList searchTerm="" onLoadingStateChange={() => {}} lastSearchTime={null} isLoading={false} />
      </MemoryRouter>,
    );

    expect(fetchCharactersMock).toHaveBeenCalled();

    const cards = await screen.findAllByTestId('card');
    expect(cards).toHaveLength(20);
  });

  it('displays an appropriate message if no cards are present', async (): Promise<void> => {
    fetchCharactersMock.mockResolvedValue({
      results: [],
      info: { count: 0, pages: 1, next: null, prev: null } as Info,
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <CardList searchTerm="" onLoadingStateChange={() => {}} lastSearchTime={null} isLoading={false} />
      </MemoryRouter>,
    );

    expect(fetchCharactersMock).toHaveBeenCalled();

    const message = await screen.findByText('No characters found');
    expect(message).toBeInTheDocument();
  });
});
