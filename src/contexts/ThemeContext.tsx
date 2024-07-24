import type { ReactNode } from 'react';
import { createContext, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';

import { LocalStorageKeys } from '@/common/enums';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface ThemeContextType {
  isDarkTheme: boolean;
  toggleTheme: () => void;
}

const DARK_THEME_CLASS = 'dark-theme';

export const ThemeContext = createContext<ThemeContextType>({
  isDarkTheme: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }): ReactNode {
  const { getStoredValue, setStoredValue } = useLocalStorage<boolean>();
  const [isDarkTheme, setIsDarkTheme] = useState(getStoredValue(LocalStorageKeys.THEME) || false);

  useLayoutEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add(DARK_THEME_CLASS);
    } else {
      document.body.classList.remove(DARK_THEME_CLASS);
    }
  }, [isDarkTheme]);

  useEffect(() => {
    setStoredValue(LocalStorageKeys.THEME, isDarkTheme);
  }, [isDarkTheme, setStoredValue]);

  const toggleTheme = useCallback((): void => setIsDarkTheme((prevTheme) => !prevTheme), []);

  const contextValue = useMemo(() => ({ isDarkTheme, toggleTheme }), [isDarkTheme, toggleTheme]);

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}
