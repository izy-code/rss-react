import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import type { CharacterListInfo } from '@/api/types';
import { SearchParams } from '@/common/enums';

import { Pagination } from './Pagination';

function TestComponent(): ReactNode {
  const location = useLocation();
  const pageNumber = new URLSearchParams(location.search).get(SearchParams.PAGE);

  return <p>URL page search parameter: {pageNumber}</p>;
}

describe('Pagination Component', () => {
  const user = userEvent.setup();
  const mockPageInfo: CharacterListInfo = { count: 20, pages: 5, next: '', prev: '' };

  it('disables the "Prev" button on the first page', () => {
    render(
      <MemoryRouter initialEntries={['/?page=1']}>
        <Pagination pageInfo={mockPageInfo} />
      </MemoryRouter>,
    );

    const prevButton = screen.getByRole('button', { name: 'Prev' });

    expect(prevButton).toBeDisabled();
  });

  it('disables the "Next" button on the last page', () => {
    render(
      <MemoryRouter initialEntries={['/?page=5']}>
        <Pagination pageInfo={mockPageInfo} />
      </MemoryRouter>,
    );

    const nextButton = screen.getByRole('button', { name: 'Next' });

    expect(nextButton).toBeDisabled();
  });

  it('updates URL query parameter when "Next" button is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/?page=2']}>
        <Pagination pageInfo={mockPageInfo} />
        <TestComponent />
      </MemoryRouter>,
    );

    const nextButton = screen.getByRole('button', { name: 'Next' });

    await user.click(nextButton);

    expect(screen.getByText('URL page search parameter: 3')).toBeInTheDocument();
  });

  it('updates URL query parameter when "Prev" button is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/?page=2']}>
        <Pagination pageInfo={mockPageInfo} />
        <TestComponent />
      </MemoryRouter>,
    );

    const prevButton = screen.getByRole('button', { name: 'Prev' });

    await user.click(prevButton);

    expect(screen.getByText('URL page search parameter: 1')).toBeInTheDocument();
  });
});
