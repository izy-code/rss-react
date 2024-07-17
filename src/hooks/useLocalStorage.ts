import { useCallback, useState } from 'react';

const LOCAL_STORAGE_KEY = 'izy-search-term-task-2';
const INITIAL_VALUE = '';

function getInitialState(): string {
  const item = localStorage.getItem(LOCAL_STORAGE_KEY);

  return item || INITIAL_VALUE;
}

export function useLocalStorage(): [string, (value: string) => void] {
  const [storedValue, setStoredValue] = useState<string>(() => getInitialState());

  const setValue = useCallback((value: string) => {
    setStoredValue(value);
    localStorage.setItem(LOCAL_STORAGE_KEY, value);
  }, []);

  return [storedValue, setValue] as const;
}
