import '@testing-library/jest-dom';

import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import * as api from '@/api/api';
import { MainPage } from '@/pages/main-page/MainPage';
import { characterMock } from '@/test/mocks/mocks';
import { renderWithUserSetup } from '@/utils/utils';

import { Details } from './Details';

describe('Details Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const fetchCharacterByIdSpy = vi.spyOn(api, 'fetchCharacterById');

  it('displays a loading indicator while fetching data', async () => {
    render(
      <MemoryRouter initialEntries={[`/?details=${characterMock.id}`]}>
        <Routes>
          <Route path="/" element={<Details />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Loading...' })).toBeInTheDocument();
    await waitFor(() =>
      expect(fetchCharacterByIdSpy).toHaveBeenCalledWith(characterMock.id.toString(), expect.any(AbortController)),
    );
  });

  it('displays the detailed card data correctly', async () => {
    render(
      <MemoryRouter initialEntries={[`/?details=${characterMock.id}`]}>
        <Routes>
          <Route path="/" element={<Details />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(fetchCharacterByIdSpy).toHaveBeenCalledWith(characterMock.id.toString(), expect.any(AbortController)),
    );

    expect(screen.getByText(characterMock.name)).toBeInTheDocument();
    expect(screen.getByText(characterMock.species)).toBeInTheDocument();
    expect(screen.getByText(characterMock.status)).toBeInTheDocument();
    expect(screen.getByText(characterMock.gender)).toBeInTheDocument();
  });

  it('hides the details section when the close button is clicked', async () => {
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
      expect(fetchCharacterByIdSpy).toHaveBeenCalledWith(characterMock.id.toString(), expect.any(AbortController)),
    );

    const closeButton = await screen.findByRole('button', { name: /close details/i });

    expect(closeButton).toBeInTheDocument();

    await user.click(closeButton);
    expect(screen.queryByRole('button', { name: /close details/i })).not.toBeInTheDocument();
  });
});
