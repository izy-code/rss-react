import '@testing-library/jest-dom';

import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { fetchCharacterById, fetchCharacters } from '@/api/api';
import { MainPage } from '@/pages/main-page/MainPage';
import { apiResponseMock, characterMock } from '@/test/mocks/mocks';
import { renderWithUserSetup } from '@/utils/utils';

import { Details } from './Details';

vi.mock('@/api/api', () => ({
  fetchCharacterById: vi.fn(),
  fetchCharacters: vi.fn(),
  DEFAULT_PAGE: 1,
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

    expect(screen.getByRole('heading', { name: 'Loading...' })).toBeInTheDocument();
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

  it('hides the details section when the close button is clicked', async () => {
    const fetchCharacterByIdMock = vi.mocked(fetchCharacterById);
    const fetchCharactersMock = vi.mocked(fetchCharacters);

    fetchCharacterByIdMock.mockResolvedValue({
      status: 'success',
      data: characterMock,
    });
    fetchCharactersMock.mockResolvedValue({
      status: 'success',
      data: {
        info: apiResponseMock.info,
        results: [],
      },
    });

    const { user } = renderWithUserSetup(
      <MemoryRouter initialEntries={[`/?details=${characterMock.id}`]}>
        <Routes>
          <Route path="/" element={<MainPage />}>
            <Route path="" element={<Details />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(fetchCharacterByIdMock).toHaveBeenCalledWith(characterMock.id.toString(), expect.any(AbortController)),
    );

    const closeButton = await screen.findByRole('button', { name: /close details/i });

    expect(closeButton).toBeInTheDocument();

    await user.click(closeButton);
    expect(screen.queryByRole('button', { name: /close details/i })).not.toBeInTheDocument();
  });
});
