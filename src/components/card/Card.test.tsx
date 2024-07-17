import '@testing-library/jest-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { fetchCharacterById } from '@/api/api';
import type { CharacterData } from '@/api/types';
import { SearchParams } from '@/common/enums';

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

function TestComponent(): ReactNode {
  const location = useLocation();
  const detailsID = new URLSearchParams(location.search).get(SearchParams.DETAILS);

  return <span>URL details ID search parameter: {detailsID}</span>;
}

describe('Card Component', () => {
  const mockCharacter: CharacterData = {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    episode: ['1', '2', '3'],
    origin: {
      name: '',
      url: '',
    },
    image: '',
    created: '',
    url: '',
    location: {
      name: '',
      url: '',
    },
    type: '',
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
        <TestComponent />
      </MemoryRouter>,
    );

    const linkElement = container.querySelector('a');
    expect(linkElement).toBeInTheDocument();

    if (linkElement) {
      fireEvent.click(linkElement);
      expect(screen.getByText(`URL details ID search parameter: ${mockCharacter.id}`)).toBeInTheDocument();
    }
  });

  it('triggers an additional API call to fetch detailed information when clicked', async (): Promise<void> => {
    const fetchCharacterByIdMock = vi.mocked(fetchCharacterById);
    fetchCharacterByIdMock.mockResolvedValue({
      status: 'success',
      data: mockCharacter,
    });

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
        expect(fetchCharacterByIdMock).toHaveBeenCalledWith(mockCharacter.id.toString(), expect.any(AbortController)),
      );
    }
  });
});
