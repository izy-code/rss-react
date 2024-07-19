import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { SearchParams } from '@/common/enums';
import { apiResponseMock } from '@/test/mocks/mocks';
import { renderWithUserSetup } from '@/utils/utils';

import { Pagination } from './Pagination';

const PAGE_TEST_ID = 'page-display';

function PageSearchParamDisplay(): ReactNode {
  const location = useLocation();
  const pageNumber = new URLSearchParams(location.search).get(SearchParams.PAGE);

  return <p data-testid={PAGE_TEST_ID}>{pageNumber}</p>;
}

describe('Pagination Component', () => {
  const pageInfoMock = apiResponseMock.info;

  it('disables the "Prev" button on the first page', () => {
    const initialPage = 1;

    render(
      <MemoryRouter initialEntries={[`/?page=${initialPage}`]}>
        <Pagination pageInfo={pageInfoMock} />
      </MemoryRouter>,
    );

    const prevButton = screen.getByRole('button', { name: 'Prev' });

    expect(prevButton).toBeDisabled();
  });

  it('disables the "Next" button on the last page', () => {
    render(
      <MemoryRouter initialEntries={[`/?page=${pageInfoMock.pages}`]}>
        <Pagination pageInfo={pageInfoMock} />
      </MemoryRouter>,
    );

    const nextButton = screen.getByRole('button', { name: 'Next' });

    expect(nextButton).toBeDisabled();
  });

  it('updates URL query parameter when "Next" button is clicked', async () => {
    const initialPage = 2;

    const { user } = renderWithUserSetup(
      <MemoryRouter initialEntries={[`/?page=${initialPage}`]}>
        <Pagination pageInfo={pageInfoMock} />
        <PageSearchParamDisplay />
      </MemoryRouter>,
    );

    const nextButton = screen.getByRole('button', { name: 'Next' });

    await user.click(nextButton);

    expect(screen.getByTestId(PAGE_TEST_ID)).toHaveTextContent(`${initialPage + 1}`);
  });

  it('updates URL query parameter when "Prev" button is clicked', async () => {
    const initialPage = 2;

    const { user } = renderWithUserSetup(
      <MemoryRouter initialEntries={[`/?page=${initialPage}`]}>
        <Pagination pageInfo={pageInfoMock} />
        <PageSearchParamDisplay />
      </MemoryRouter>,
    );

    const prevButton = screen.getByRole('button', { name: 'Prev' });

    await user.click(prevButton);

    expect(screen.getByTestId(PAGE_TEST_ID)).toHaveTextContent(`${initialPage - 1}`);
  });
});
