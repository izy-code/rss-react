import '@testing-library/jest-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { fetchCharacterById } from '@/api/api';
import type { Character } from '@/api/types';

import { Details } from '../details/Details';
import { Card } from './Card';

vi.mock('@/api/api', () => ({
  fetchCharacterById: vi.fn(),
}));

vi.mock('../image-loader/ImageLoader', () => ({
  ImageLoader: ({ imageSrc, imageAlt }: { imageSrc: string; imageAlt: string }): ReactNode => (
    <img src={imageSrc} alt={imageAlt} />
  ),
}));

describe('Card Component', () => {
  const mockCharacter: Character = {
    id: 1,
    name: 'Rick Sanchez',
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    species: 'Human',
    status: 'Alive',
    gender: 'Male',
    episode: [],
    origin: { name: 'Earth (C-137)', url: '' },
    location: { name: 'Earth (Replacement Dimension)', url: '' },
    type: '',
    url: '',
    created: '',
  };

  it('renders the relevant card data', (): void => {
    render(
      <MemoryRouter>
        <Card character={mockCharacter} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByAltText('Rick Sanchez')).toHaveAttribute('src', mockCharacter.image);
  });

  it('changes URL search params when clicked', (): void => {
    const { container } = render(
      <MemoryRouter>
        <Card character={mockCharacter} />
      </MemoryRouter>,
    );

    const linkElement = container.querySelector('a');
    expect(linkElement).toBeInTheDocument();

    if (linkElement) {
      fireEvent.click(linkElement);
      const searchParams = new URLSearchParams(linkElement.getAttribute('href')!);
      expect(searchParams.get('details')).toBe(String(mockCharacter.id));
    }
  });

  it('triggers an additional API call to fetch detailed information when clicked', async (): Promise<void> => {
    const fetchCharacterByIdMock = vi.mocked(fetchCharacterById);
    fetchCharacterByIdMock.mockResolvedValue(mockCharacter);

    render(
      <MemoryRouter initialEntries={[`/?details=${mockCharacter.id}`]}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Card character={mockCharacter} />
                <Details />
              </>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    const linkElement = screen.getByText('Rick Sanchez').closest('a');
    if (linkElement) {
      fireEvent.click(linkElement);
      await waitFor(() =>
        expect(fetchCharacterByIdMock).toHaveBeenCalledWith(mockCharacter.id, expect.any(AbortController)),
      );
    }
  });
});
