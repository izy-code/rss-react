import '@testing-library/jest-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import type { Info } from '@/api/types';

import { Pagination } from './Pagination';

const mockOnPageChange = vi.fn();

describe('Pagination Component', () => {
  const mockPageInfo: Info = { count: 20, pages: 5, next: '', prev: '' };

  it('disables the "Prev" button on the first page', () => {
    render(
      <MemoryRouter>
        <Pagination currentPage={1} pageInfo={mockPageInfo} onPageChange={mockOnPageChange} />
      </MemoryRouter>,
    );

    const prevButton = screen.getByText('Prev');
    expect(prevButton).toBeDisabled();
  });

  it('disables the "Next" button on the last page', () => {
    render(
      <MemoryRouter>
        <Pagination currentPage={5} pageInfo={mockPageInfo} onPageChange={mockOnPageChange} />
      </MemoryRouter>,
    );

    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('calls onPageChange with the correct argument when "Next" button is clicked', () => {
    render(
      <MemoryRouter>
        <Pagination currentPage={2} pageInfo={mockPageInfo} onPageChange={mockOnPageChange} />
      </MemoryRouter>,
    );

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange with the correct argument when "Prev" button is clicked', () => {
    render(
      <MemoryRouter>
        <Pagination currentPage={2} pageInfo={mockPageInfo} onPageChange={mockOnPageChange} />
      </MemoryRouter>,
    );

    const prevButton = screen.getByText('Prev');
    fireEvent.click(prevButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it('updates URL query parameter when page changes', async () => {
    const mockSetSearchParams = vi.fn();
    function TestComponent(): ReactNode {
      const [searchParams, setSearchParams] = useSearchParams();
      const handlePageChange = (page: number): void => {
        searchParams.set('page', String(page));
        setSearchParams(searchParams);
        mockSetSearchParams(searchParams);
      };

      return (
        <Pagination
          currentPage={Number(searchParams.get('page')) || 1}
          pageInfo={mockPageInfo}
          onPageChange={handlePageChange}
        />
      );
    }

    render(
      <MemoryRouter initialEntries={['/?page=1']}>
        <TestComponent />
      </MemoryRouter>,
    );

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(URLSearchParams));
      const updatedSearchParams = mockSetSearchParams?.mock?.calls?.[0]?.[0] as URLSearchParams;
      expect(updatedSearchParams.get('page')).toBe('2');
    });
  });
});
