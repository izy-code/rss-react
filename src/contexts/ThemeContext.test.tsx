import '@testing-library/jest-dom';

import { render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useContext } from 'react';

import { LocalStorageKeys } from '@/common/enums';
import { getLocalStorage, LOCAL_STORAGE_KEY } from '@/hooks/useLocalStorage';
import { renderWithUserSetup } from '@/utils/test-utils';

import { ThemeContext, ThemeProvider } from './ThemeContext';

const THEME_TEST_ID = 'theme-display';

function TestComponent(): ReactNode {
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);
  return (
    <div>
      <span data-testid={THEME_TEST_ID}>{isDarkTheme ? 'Dark' : 'Light'}</span>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes theme based on localStorage', async () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ [LocalStorageKeys.THEME]: true }));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId(THEME_TEST_ID)).toHaveTextContent('Dark');
    });
  });

  it('saves the current theme to localStorage when toggled', async () => {
    const { user } = renderWithUserSetup(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    const button = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(button);

    await waitFor(() => {
      expect(getLocalStorage()[LocalStorageKeys.THEME]).toBeTruthy();
    });

    await user.click(button);

    await waitFor(() => {
      expect(getLocalStorage()[LocalStorageKeys.THEME]).toBeFalsy();
    });
  });

  it('toggles theme correctly', async () => {
    const { user } = renderWithUserSetup(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    const themeStatus = screen.getByTestId(THEME_TEST_ID);
    const button = screen.getByRole('button', { name: /toggle theme/i });

    expect(themeStatus).toHaveTextContent('Light');

    await user.click(button);
    expect(themeStatus).toHaveTextContent('Dark');

    await user.click(button);
    expect(themeStatus).toHaveTextContent('Light');
  });
});
