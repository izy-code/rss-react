import '@testing-library/jest-dom';

import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { MainPage } from '@/pages/main-page/MainPage';
import { BASE_URL } from '@/store/api/api-slice';
import { characterMock } from '@/test/mocks/mocks';
import { renderWithProvidersAndUser } from '@/utils/test-utils';

import { Details } from './Details';

describe('Details Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('displays a loading indicator while fetching data', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    renderWithProvidersAndUser(
      <MemoryRouter initialEntries={[`/?details=${characterMock.id}`]}>
        <Details />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: /loading.../i })).toBeInTheDocument();

    await waitFor(() =>
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.objectContaining({ url: `${BASE_URL}character/${characterMock.id}` }),
      ),
    );
  });

  it('displays the detailed card data correctly', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    renderWithProvidersAndUser(
      <MemoryRouter initialEntries={[`/?details=${characterMock.id}`]}>
        <Details />
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.objectContaining({ url: `${BASE_URL}character/${characterMock.id}` }),
      ),
    );

    expect(screen.getByText(characterMock.name)).toBeInTheDocument();
    expect(screen.getByText(characterMock.species)).toBeInTheDocument();
    expect(screen.getByText(characterMock.status)).toBeInTheDocument();
    expect(screen.getByText(characterMock.gender)).toBeInTheDocument();
  });

  it('hides the details section when the close button is clicked', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const { user } = renderWithProvidersAndUser(
      <MemoryRouter initialEntries={[`/?details=${characterMock.id}`]}>
        <Routes>
          <Route path="/" element={<MainPage />}>
            <Route path="" element={<Details />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.objectContaining({ url: `${BASE_URL}character/${characterMock.id}` }),
      ),
    );

    const closeButton = await screen.findByRole('button', { name: /close details/i });

    expect(closeButton).toBeInTheDocument();

    await user.click(closeButton);
    expect(screen.queryByRole('button', { name: /close details/i })).not.toBeInTheDocument();
  });
});
