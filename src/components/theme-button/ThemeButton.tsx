'use client';

import clsx from 'clsx';
import type { ReactNode } from 'react';

import { useTheme } from '@/hooks/useTheme';

import { CustomButton } from '../custom-button/CustomButton';
import styles from './ThemeButton.module.scss';

export function ThemeButton(): ReactNode {
  const { isDarkTheme, toggleTheme } = useTheme();

  return (
    <CustomButton
      className={clsx(styles.button, styles[isDarkTheme ? 'dark' : ''])}
      variant="secondary"
      onClick={toggleTheme}
    >
      <span className="visually-hidden">{isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}</span>
    </CustomButton>
  );
}
