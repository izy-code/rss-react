import { useCallback } from 'react';

import type { LocalStorageKeys } from '@/common/enums';

export const LOCAL_STORAGE_KEY = 'izy-react-task-3';

export function getLocalStorage<T>(): Record<string, T> | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const item = localStorage.getItem(LOCAL_STORAGE_KEY);
  return item ? (JSON.parse(item) as Record<string, T>) : {};
}

export function useLocalStorage<T>(): {
  getStoredValue: (key: LocalStorageKeys) => T | null;
  setStoredValue: (key: LocalStorageKeys, value: T) => void;
} {
  const getStoredValue = useCallback((key: LocalStorageKeys): T | null => {
    const localStorageMap = getLocalStorage<T>();

    return localStorageMap?.[key] || null;
  }, []);

  const setStoredValue = useCallback((key: LocalStorageKeys, value: T) => {
    if (typeof window === 'undefined') {
      return;
    }

    let localStorageMap = getLocalStorage<T>();

    localStorageMap = { ...localStorageMap, [key]: value };

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localStorageMap));
  }, []);

  return { getStoredValue, setStoredValue };
}
