import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { LocalStorageKeys } from '@/common/enums';
import { LOCAL_STORAGE_KEY } from '@/hooks/useLocalStorage';
import { MOCK_SEARCH_NAME } from '@/test/msw/handlers.ts';
import { renderWithProvidersAndUser } from '@/utils/test-utils';

import { SearchForm } from './SearchForm';

describe('SearchForm Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves the entered value to localStorage when Search button is clicked', async () => {
    const { user } = renderWithProvidersAndUser(
      <MemoryRouter>
        <SearchForm />
      </MemoryRouter>,
    );

    const searchInput = screen.getByRole('searchbox');
    const searchButton = screen.getByRole('button', { name: /search/i });

    await user.click(searchInput);
    await user.type(searchInput, MOCK_SEARCH_NAME);
    await user.click(searchButton);

    const localStorageMap = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)!) as Record<string, string>;
    expect(localStorageMap).toEqual({ [LocalStorageKeys.SEARCH]: MOCK_SEARCH_NAME });
  });

  it('retrieves the value from localStorage upon mounting', () => {
    const storedValue = { [LocalStorageKeys.SEARCH]: MOCK_SEARCH_NAME };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedValue));

    renderWithProvidersAndUser(
      <MemoryRouter>
        <SearchForm />
      </MemoryRouter>,
    );

    const searchInput = screen.getByRole('searchbox');
    expect(searchInput).toHaveValue(MOCK_SEARCH_NAME);
  });
});
