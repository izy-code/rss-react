import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

import { SearchForm } from './SearchForm';

describe('SearchForm Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves the entered value to localStorage when Search button is clicked', () => {
    render(
      <MemoryRouter>
        <SearchForm
          onSearch={(term) => {
            localStorage.setItem('LS_KEY', term);
          }}
          initialSearchTerm=""
          isDisabled={false}
        />
      </MemoryRouter>,
    );

    const searchInput = screen.getByPlaceholderText('Enter character name…');
    const searchButton = screen.getByText('Search');

    const newSearchTerm = 'Rick';
    fireEvent.change(searchInput, { target: { value: newSearchTerm } });
    fireEvent.click(searchButton);

    expect(localStorage.getItem('LS_KEY')).toBe(newSearchTerm);
  });
});
