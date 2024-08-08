'use client';

import type { FormEvent, ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { DEFAULT_PAGE } from '@/api/api';
import { LocalStorageKeys, SearchParams } from '@/common/enums';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useQueries } from '@/hooks/useQueries';

import { CustomButton } from '../custom-button/CustomButton';
import styles from './SearchForm.module.scss';

export function SearchForm(): ReactNode {
  const { getStoredValue, setStoredValue } = useLocalStorage<string>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { queryParams, name, setSearchParam, router } = useQueries();
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (searchTerm && queryParams.size === 0) {
      inputRef.current!.value = searchTerm;
      setSearchParam(SearchParams.NAME, searchTerm);
    } else if (searchTerm !== name && queryParams.size > 0) {
      updateSearchTerm(name);
      inputRef.current!.value = name;
    }
  }, [searchTerm, updateSearchTerm, name, queryParams.size, setSearchParam]);

  useEffect(() => {
    inputRef.current?.focus();
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const inputSearchTerm = inputRef.current?.value.trim() ?? '';

    updateSearchTerm(inputSearchTerm);

    const params = new URLSearchParams(queryParams.toString());

    params.set(SearchParams.PAGE, DEFAULT_PAGE.toString());

    if (inputSearchTerm) {
      params.set(SearchParams.NAME, inputSearchTerm);
    } else {
      params.delete(SearchParams.NAME);
    }

    router.push(`?${params.toString()}`);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        className={styles.input}
        type="search"
        placeholder="Enter character name…"
        defaultValue={searchTerm}
        autoComplete="off"
      />
      <CustomButton type="submit" variant="secondary">
        Search
      </CustomButton>
    </form>
  );
}
