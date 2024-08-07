import { screen } from '@testing-library/react';

import { SearchParams } from '@/common/enums';
import Home from '@/pages';
import { characterMock } from '@/test/mocks/mocks';
import { getMockedNextRouter, renderWithProvidersAndUser } from '@/utils/test-utils';

import { Details } from './Details';

describe('Details Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('displays a loading indicator while fetching data', async () => {
    const { NextProvider } = getMockedNextRouter({ query: { [SearchParams.DETAILS]: characterMock.id.toString() } });

    renderWithProvidersAndUser(
      <NextProvider>
        <Details />
      </NextProvider>,
    );

    expect(await screen.findByRole('heading', { name: /loading.../i })).toBeInTheDocument();
  });

  it('displays the detailed card data correctly', async () => {
    const { NextProvider } = getMockedNextRouter({ query: { [SearchParams.DETAILS]: characterMock.id.toString() } });

    renderWithProvidersAndUser(
      <NextProvider>
        <Details />
      </NextProvider>,
    );

    expect(await screen.findByText(characterMock.name)).toBeInTheDocument();
    expect(screen.getByText(characterMock.species)).toBeInTheDocument();
    expect(screen.getByText(characterMock.status)).toBeInTheDocument();
    expect(screen.getByText(characterMock.gender)).toBeInTheDocument();
  });

  it('hides the details section when the close button is clicked by deleting the query param', async () => {
    const { NextProvider, nextRouter } = getMockedNextRouter({
      query: { [SearchParams.DETAILS]: characterMock.id.toString() },
    });

    const { user } = renderWithProvidersAndUser(
      <NextProvider>
        <Home />
      </NextProvider>,
    );

    const closeButton = await screen.findByRole('button', { name: /close details/i });

    expect(closeButton).toBeInTheDocument();

    await user.click(closeButton);

    expect(nextRouter.push).toHaveBeenCalledWith({ query: {} }, undefined, {
      scroll: false,
      shallow: true,
    });
  });
});
