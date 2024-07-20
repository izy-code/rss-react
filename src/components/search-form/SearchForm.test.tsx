import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { MOCK_SEARCH_NAME } from '@/test/msw/handlers.ts';
import { renderWithUserSetup } from '@/utils/utils';

import { SearchForm } from './SearchForm';

describe('SearchForm Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves the entered value to localStorage when Search button is clicked', async () => {
    const { user } = renderWithUserSetup(
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

    const searchInput = screen.getByRole('searchbox');
    const searchButton = screen.getByRole('button', { name: 'Search' });

    await user.type(searchInput, MOCK_SEARCH_NAME);
    await user.click(searchButton);

    expect(localStorage.getItem('LS_KEY')).toBe(MOCK_SEARCH_NAME);
  });
});
