import { useSearchParams } from '@remix-run/react';
import type { FormEvent, ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { LocalStorageKeys, SearchParams } from '@/common/enums';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { DEFAULT_PAGE, useGetCharactersListQuery } from '@/store/api/api-slice';

import { CustomButton } from '../custom-button/CustomButton';
import styles from './SearchForm.module.scss';

export function SearchForm(): ReactNode {
  const { getStoredValue, setStoredValue } = useLocalStorage<string>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const pageParam = Number(searchParams.get(SearchParams.PAGE));

  const { isFetching: isDisabled } = useGetCharactersListQuery({
    searchTerm,
    page: pageParam,
  });

  const updateSearchTerm = useCallback(
    (newTerm: string): void => {
      setStoredValue(LocalStorageKeys.SEARCH, newTerm);
      setSearchTerm(newTerm);
    },
    [setStoredValue],
  );

  useEffect(() => {
    setSearchTerm(getStoredValue(LocalStorageKeys.SEARCH) || '');
  }, [getStoredValue]);

  useEffect(() => {
    const nameParam = searchParams.get(SearchParams.NAME) ?? '';

    if (searchTerm && searchParams.size === 1) {
      inputRef.current!.value = searchTerm;
      searchParams.set(SearchParams.NAME, searchTerm);
      setSearchParams(searchParams);
    } else if (searchTerm !== nameParam && searchParams.size > 1) {
      updateSearchTerm(nameParam);
      inputRef.current!.value = nameParam;
    }
  }, [searchTerm, searchParams, setSearchParams, updateSearchTerm]);

  useEffect(() => {
    if (!isDisabled) {
      inputRef.current?.focus();
    }
  }, [isDisabled]);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const inputSearchTerm = inputRef.current?.value.trim() ?? '';

    updateSearchTerm(inputSearchTerm);
    searchParams.set(SearchParams.PAGE, DEFAULT_PAGE.toString());

    if (inputSearchTerm) {
      searchParams.set(SearchParams.NAME, inputSearchTerm);
    } else {
      searchParams.delete(SearchParams.NAME);
    }

    setSearchParams(searchParams);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        className={styles.input}
        type="search"
        placeholder="Enter character name…"
        defaultValue={searchTerm}
        disabled={isDisabled}
        autoComplete="off"
      />
      <CustomButton type="submit" variant="secondary" disabled={isDisabled}>
        Search
      </CustomButton>
    </form>
  );
}
