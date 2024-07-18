import '@testing-library/jest-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { fetchCharacterById } from '@/api/api';
import { SearchParams } from '@/common/enums';
import { characterMock } from '@/test/mocks/mocks';

import { Details } from './Details';

vi.mock('@/api/api', () => ({
  fetchCharacterById: vi.fn(),
}));

vi.mock('../image-loader/ImageLoader', () => ({
  ImageLoader: ({ imageSrc, imageAlt }: { imageSrc: string; imageAlt: string }): ReactNode => (
    <img src={imageSrc} alt={imageAlt} />
  ),
}));

describe('Details Component', () => {
  it('displays a loading indicator while fetching data', async () => {
    const fetchCharacterByIdMock = vi.mocked(fetchCharacterById);
    fetchCharacterByIdMock.mockResolvedValueOnce({
      status: 'success',
      data: characterMock,
    });

    render(
      <MemoryRouter initialEntries={[`/?details=${characterMock.id}`]}>
        <Routes>
          <Route path="/" element={<Details />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    await waitFor(() =>
      expect(fetchCharacterByIdMock).toHaveBeenCalledWith(characterMock.id.toString(), expect.any(AbortController)),
    );
  });

  it('displays the detailed card data correctly', async () => {
    const fetchCharacterByIdMock = vi.mocked(fetchCharacterById);
    fetchCharacterByIdMock.mockResolvedValueOnce({
      status: 'success',
      data: characterMock,
    });

    render(
      <MemoryRouter initialEntries={[`/?details=${characterMock.id}`]}>
        <Routes>
          <Route path="/" element={<Details />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(fetchCharacterByIdMock).toHaveBeenCalledWith(characterMock.id.toString(), expect.any(AbortController)),
    );

    expect(screen.getByText(characterMock.name)).toBeInTheDocument();
    expect(screen.getByText(characterMock.species)).toBeInTheDocument();
    expect(screen.getByText(characterMock.status)).toBeInTheDocument();
    expect(screen.getByText(characterMock.gender)).toBeInTheDocument();
  });

  it('hides the component when the close button is clicked', async () => {
    const fetchCharacterByIdMock = vi.mocked(fetchCharacterById);
    fetchCharacterByIdMock.mockResolvedValueOnce({
      status: 'success',
      data: characterMock,
    });

    render(
      <MemoryRouter initialEntries={[`/?details=${characterMock.id}`]}>
        <Routes>
          <Route path="/" element={<Details />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(fetchCharacterByIdMock).toHaveBeenCalledWith(characterMock.id.toString(), expect.any(AbortController)),
    );

    expect(screen.getByText(characterMock.name)).toBeInTheDocument();

    const closeButton = screen.getByText('Close details');
    fireEvent.click(closeButton);

    await waitFor(() => {
      const searchParams = new URLSearchParams(window.location.search);
      expect(searchParams.get(SearchParams.DETAILS)).toBeNull();
    });
  });
});
