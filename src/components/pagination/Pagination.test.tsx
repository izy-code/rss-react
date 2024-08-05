import { screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import { SearchParams } from '@/common/enums';
import { charactersDataMock } from '@/test/mocks/mocks';
import { renderWithProvidersAndUser } from '@/utils/test-utils';

import { Pagination } from './Pagination';

const PAGE_TEST_ID = 'page-display';

vi.mock('next/router', () => ({
  useRouter: vi.fn(),
}));

const mockedUseRouter = useRouter as Mock;

function PageSearchParamDisplay(): ReactNode {
  const { query } = useRouter();
  const pageNumber = query[SearchParams.PAGE];

  return <p data-testid={PAGE_TEST_ID}>{pageNumber}</p>;
}

describe('Pagination Component', () => {
  const pageInfoMock = charactersDataMock.info;

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('disables the "Prev" button on the first page', () => {
    const initialPage = 1;

    mockedUseRouter.mockReturnValue({
      query: { [SearchParams.PAGE]: initialPage.toString() },
      push: vi.fn(),
    });

    renderWithProvidersAndUser(
      <>
        <Pagination pageInfo={pageInfoMock} />
        <PageSearchParamDisplay />
      </>,
    );

    const prevButton = screen.getByRole('button', { name: /prev/i });

    expect(prevButton).toBeDisabled();
  });

  it('disables the "Next" button on the last page', () => {
    mockedUseRouter.mockReturnValue({
      query: { [SearchParams.PAGE]: pageInfoMock.pages.toString() },
      push: vi.fn(),
    });

    renderWithProvidersAndUser(
      <>
        <Pagination pageInfo={pageInfoMock} />
        <PageSearchParamDisplay />
      </>,
    );

    const nextButton = screen.getByRole('button', { name: /next/i });

    expect(nextButton).toBeDisabled();
  });

  it('updates URL query parameter when "Next" button is clicked', async () => {
    const initialPage = 2;
    const pushMock = vi.fn();

    mockedUseRouter.mockReturnValue({
      query: { [SearchParams.PAGE]: initialPage.toString() },
      push: pushMock,
    });

    const { user } = renderWithProvidersAndUser(
      <>
        <Pagination pageInfo={pageInfoMock} />
        <PageSearchParamDisplay />
      </>,
    );

    const nextButton = screen.getByRole('button', { name: /next/i });

    await user.click(nextButton);

    expect(pushMock).toHaveBeenCalledWith(
      expect.objectContaining({
        query: { [SearchParams.PAGE]: (initialPage + 1).toString() },
      }),
    );
  });

  it('updates URL query parameter when "Prev" button is clicked', async () => {
    const initialPage = 2;
    const pushMock = vi.fn();

    mockedUseRouter.mockReturnValue({
      query: { [SearchParams.PAGE]: initialPage.toString() },
      push: pushMock,
    });

    const { user } = renderWithProvidersAndUser(
      <>
        <Pagination pageInfo={pageInfoMock} />
        <PageSearchParamDisplay />
      </>,
    );

    const prevButton = screen.getByRole('button', { name: /prev/i });

    await user.click(prevButton);

    expect(pushMock).toHaveBeenCalledWith(
      expect.objectContaining({
        query: { [SearchParams.PAGE]: (initialPage - 1).toString() },
      }),
    );
  });
});
