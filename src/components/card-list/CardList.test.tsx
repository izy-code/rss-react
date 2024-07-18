import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchCharacters } from '@/api/api';
import type { CharacterData } from '@/api/types';
import { apiResponseMock } from '@/test/mocks/mocks';

import { CardList } from './CardList';

vi.mock('@/api/api', () => ({
  fetchCharacters: vi.fn(),
  DEFAULT_PAGE: 1,
}));

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
  const fetchCharactersMock = vi.mocked(fetchCharacters);

  afterEach((): void => {
    vi.clearAllMocks();
  });

  it('renders the specified number of cards', async (): Promise<void> => {
    fetchCharactersMock.mockResolvedValue({
      status: 'success',
      data: apiResponseMock,
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <CardList searchTerm="" setIsLoading={() => {}} lastSearchTime={null} isLoading={false} />
      </MemoryRouter>,
    );

    expect(fetchCharactersMock).toHaveBeenCalled();

    const cards = await screen.findAllByRole('listitem');
    expect(cards).toHaveLength(apiResponseMock.info.count);
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
