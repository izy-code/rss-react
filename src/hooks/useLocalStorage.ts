import { useCallback, useState } from 'react';

import type { LocalStorageKeys } from '@/common/enums';

const LOCAL_STORAGE_KEY = 'izy-search-term-task-3';

function getInitialState<T>(): Record<string, T> {
  const item = localStorage.getItem(LOCAL_STORAGE_KEY);
  return item ? (JSON.parse(item) as Record<string, T>) : {};
}

export function useLocalStorage<T>(): {
  getStoredValue: (key: LocalStorageKeys) => T | null;
  setStoredValue: (key: LocalStorageKeys, value: T) => void;
} {
  const [storedMap, setStoredMap] = useState<Record<string, T>>(() => getInitialState<T>());

  const setStoredValue = useCallback((key: LocalStorageKeys, value: T) => {
    setStoredMap((prevMap) => {
      const updatedMap = { ...prevMap, [key]: value };

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedMap));

      return updatedMap;
    });
  }, []);

  const getStoredValue = useCallback((key: LocalStorageKeys): T | null => storedMap[key] ?? null, [storedMap]);

  return { getStoredValue, setStoredValue };
}
