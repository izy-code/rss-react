import '@testing-library/jest-dom';

import { MemoryRouter, Route, Routes } from '@remix-run/react';
import { screen } from '@testing-library/react';

import { MainPage } from '@/pages/main-page/MainPage';
import { characterMock } from '@/test/mocks/mocks';
import { renderWithProvidersAndUser } from '@/utils/test-utils';

import { Details } from './Details';

describe('Details Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('displays a loading indicator while fetching data', async () => {
    renderWithProvidersAndUser(
      <MemoryRouter initialEntries={[`/?details=${characterMock.id}`]}>
        <Details />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: /loading.../i })).toBeInTheDocument();
  });

  it('displays the detailed card data correctly', async () => {
    renderWithProvidersAndUser(
      <MemoryRouter initialEntries={[`/?details=${characterMock.id}`]}>
        <Details />
      </MemoryRouter>,
    );

    expect(await screen.findByText(characterMock.name)).toBeInTheDocument();
    expect(screen.getByText(characterMock.species)).toBeInTheDocument();
    expect(screen.getByText(characterMock.status)).toBeInTheDocument();
    expect(screen.getByText(characterMock.gender)).toBeInTheDocument();
  });

  it('hides the details section when the close button is clicked', async () => {
    const { user } = renderWithProvidersAndUser(
      <MemoryRouter initialEntries={[`/?details=${characterMock.id}`]}>
        <Routes>
          <Route path="/" element={<MainPage />}>
            <Route path="" element={<Details />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    const closeButton = await screen.findByRole('button', { name: /close details/i });

    expect(closeButton).toBeInTheDocument();

    await user.click(closeButton);
    expect(screen.queryByRole('button', { name: /close details/i })).not.toBeInTheDocument();
  });
});
