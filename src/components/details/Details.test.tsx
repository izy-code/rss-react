import '@testing-library/jest-dom';

import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, MemoryRouter, Route, RouterProvider, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { fetchCharacterById, fetchCharacters } from '@/api/api';
import { routes } from '@/router/routes';
import { apiResponseMock, characterMock } from '@/test/mocks/mocks';

import { Details } from './Details';

vi.mock('@/api/api', () => ({
  fetchCharacterById: vi.fn(),
  fetchCharacters: vi.fn(),
  DEFAULT_PAGE: 1,
}));

describe('Details Component', () => {
  const user = userEvent.setup();

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

    const router = createMemoryRouter(routes, { initialEntries: [`/?details=${characterMock.id}`] });

    render(<RouterProvider router={router} />);

    await waitFor(() =>
      expect(fetchCharacterByIdMock).toHaveBeenCalledWith(characterMock.id.toString(), expect.any(AbortController)),
    );

    expect(await screen.findByText(characterMock.species)).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: 'Close details' });
    void user.click(closeButton);

    await waitForElementToBeRemoved(closeButton);
  });
});
