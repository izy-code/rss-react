import { screen } from '@testing-library/react';
import { vi } from 'vitest';

import { SearchParams } from '@/common/enums';
import { charactersDataMock } from '@/test/mocks/mocks';
import { getMockedNextRouter, renderWithProvidersAndUser } from '@/utils/test-utils';

import { Pagination } from './Pagination';

describe('Pagination Component', () => {
  const pageInfoMock = charactersDataMock.info;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('disables the "Prev" button on the first page', () => {
    const initialPage = 1;

    const { NextProvider } = getMockedNextRouter({ query: { [SearchParams.PAGE]: initialPage.toString() } });

    renderWithProvidersAndUser(
      <NextProvider>
        <Pagination pageInfo={pageInfoMock} />
      </NextProvider>,
    );

    const prevButton = screen.getByRole('button', { name: /prev/i });

    expect(prevButton).toBeDisabled();
  });

  it('disables the "Next" button on the last page', () => {
    const { NextProvider } = getMockedNextRouter({ query: { [SearchParams.PAGE]: pageInfoMock.pages.toString() } });

    renderWithProvidersAndUser(
      <NextProvider>
        <Pagination pageInfo={pageInfoMock} />
      </NextProvider>,
    );

    const nextButton = screen.getByRole('button', { name: /next/i });

    expect(nextButton).toBeDisabled();
  });

  it('updates URL query parameter when "Next" button is clicked', async () => {
    const initialPage = 2;

    const { NextProvider, nextRouter } = getMockedNextRouter({
      query: { [SearchParams.PAGE]: initialPage.toString() },
    });

    const { user } = renderWithProvidersAndUser(
      <NextProvider>
        <Pagination pageInfo={pageInfoMock} />
      </NextProvider>,
    );

    const nextButton = screen.getByRole('button', { name: /next/i });

    await user.click(nextButton);

    expect(nextRouter.push).toHaveBeenCalledWith({
      query: { [SearchParams.PAGE]: (initialPage + 1).toString() },
    });
  });

  it('updates URL query parameter when "Prev" button is clicked', async () => {
    const initialPage = 2;

    const { NextProvider, nextRouter } = getMockedNextRouter({
      query: { [SearchParams.PAGE]: initialPage.toString() },
    });

    const { user } = renderWithProvidersAndUser(
      <NextProvider>
        <Pagination pageInfo={pageInfoMock} />
      </NextProvider>,
    );

    const prevButton = screen.getByRole('button', { name: /prev/i });

    await user.click(prevButton);

    expect(nextRouter.push).toHaveBeenCalledWith(
      expect.objectContaining({
        query: { [SearchParams.PAGE]: (initialPage - 1).toString() },
      }),
    );
  });
});
