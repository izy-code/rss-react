import { useLocation } from '@remix-run/react';
import { createRemixStub } from '@remix-run/testing';
import { screen } from '@testing-library/react';
import type { ReactNode } from 'react';

import { SearchParams } from '@/common/enums';
import { charactersDataMock } from '@/test/mocks/mocks';
import { renderWithProvidersAndUser } from '@/utils/test-utils';

import { Pagination } from './Pagination';

const PAGE_TEST_ID = 'page-display';

function PageSearchParamDisplay(): ReactNode {
  const location = useLocation();
  const pageNumber = new URLSearchParams(location.search).get(SearchParams.PAGE);

  return <p data-testid={PAGE_TEST_ID}>{pageNumber}</p>;
}

describe('Pagination Component', () => {
  const pageInfoMock = charactersDataMock.info;

  it('disables the "Prev" button on the first page', () => {
    const initialPage = 1;

    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: (): ReactNode => <Pagination pageInfo={pageInfoMock} />,
      },
    ]);

    renderWithProvidersAndUser(<RemixStub initialEntries={[`/?page=${initialPage}`]} />);

    const prevButton = screen.getByRole('button', { name: /prev/i });

    expect(prevButton).toBeDisabled();
  });

  it('disables the "Next" button on the last page', () => {
    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: (): ReactNode => <Pagination pageInfo={pageInfoMock} />,
      },
    ]);

    renderWithProvidersAndUser(<RemixStub initialEntries={[`/?page=${pageInfoMock.pages}`]} />);

    const nextButton = screen.getByRole('button', { name: /next/i });

    expect(nextButton).toBeDisabled();
  });

  it('updates URL query parameter when "Next" button is clicked', async () => {
    const initialPage = 2;

    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: (): ReactNode => (
          <>
            <Pagination pageInfo={pageInfoMock} />
            <PageSearchParamDisplay />
          </>
        ),
      },
    ]);

    const { user } = renderWithProvidersAndUser(<RemixStub initialEntries={[`/?page=${initialPage}`]} />);

    const nextButton = screen.getByRole('button', { name: /next/i });

    await user.click(nextButton);

    expect(screen.getByTestId(PAGE_TEST_ID)).toHaveTextContent(`${initialPage + 1}`);
  });

  it('updates URL query parameter when "Prev" button is clicked', async () => {
    const initialPage = 2;

    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: (): ReactNode => (
          <>
            <Pagination pageInfo={pageInfoMock} />
            <PageSearchParamDisplay />
          </>
        ),
      },
    ]);

    const { user } = renderWithProvidersAndUser(<RemixStub initialEntries={[`/?page=${initialPage}`]} />);

    const prevButton = screen.getByRole('button', { name: /prev/i });

    await user.click(prevButton);

    expect(screen.getByTestId(PAGE_TEST_ID)).toHaveTextContent(`${initialPage - 1}`);
  });
});
