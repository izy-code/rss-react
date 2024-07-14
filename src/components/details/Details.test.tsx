import '@testing-library/jest-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { fetchCharacterById } from '@/api/api';
import type { Character } from '@/api/types';

import { Details } from './Details';

vi.mock('@/api/api', () => ({
  fetchCharacterById: vi.fn(),
}));

vi.mock('../image-loader/ImageLoader', () => ({
  ImageLoader: ({ imageSrc, imageAlt }: { imageSrc: string; imageAlt: string }): ReactNode => (
    <img src={imageSrc} alt={imageAlt} />
  ),
}));

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

describe('Details Component', () => {
  it('displays a loading indicator while fetching data', async () => {
    const fetchCharacterByIdMock = vi.mocked(fetchCharacterById);
    fetchCharacterByIdMock.mockResolvedValueOnce(mockCharacter);

    render(
      <MemoryRouter initialEntries={[`/?details=${mockCharacter.id}`]}>
        <Routes>
          <Route path="/" element={<Details />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
    await waitFor(() =>
      expect(fetchCharacterByIdMock).toHaveBeenCalledWith(mockCharacter.id, expect.any(AbortController)),
    );
  });

  it('displays the detailed card data correctly', async () => {
    const fetchCharacterByIdMock = vi.mocked(fetchCharacterById);
    fetchCharacterByIdMock.mockResolvedValueOnce(mockCharacter);

    render(
      <MemoryRouter initialEntries={[`/?details=${mockCharacter.id}`]}>
        <Routes>
          <Route path="/" element={<Details />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(fetchCharacterByIdMock).toHaveBeenCalledWith(mockCharacter.id, expect.any(AbortController)),
    );

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Human')).toBeInTheDocument();
    expect(screen.getByText('Alive')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
  });

  it('hides the component when the close button is clicked', async () => {
    const fetchCharacterByIdMock = vi.mocked(fetchCharacterById);
    fetchCharacterByIdMock.mockResolvedValueOnce(mockCharacter);

    render(
      <MemoryRouter initialEntries={[`/?details=${mockCharacter.id}`]}>
        <Routes>
          <Route path="/" element={<Details />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(fetchCharacterByIdMock).toHaveBeenCalledWith(mockCharacter.id, expect.any(AbortController)),
    );

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();

    const closeButton = screen.getByText('Close details');
    fireEvent.click(closeButton);

    await waitFor(() => {
      const searchParams = new URLSearchParams(window.location.search);
      expect(searchParams.get('details')).toBeNull();
    });
  });
});
