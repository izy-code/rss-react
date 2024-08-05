import { useContext } from 'react';

import type { ThemeContextType } from '@/contexts/ThemeContext';
import { ThemeContext } from '@/contexts/ThemeContext';

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme can only be used inside ThemeProvider');
  }

  return context;
};
