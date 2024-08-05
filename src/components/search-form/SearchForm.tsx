import { useRouter } from 'next/router';
import type { FormEvent, ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { LocalStorageKeys } from '@/common/enums';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { DEFAULT_PAGE, useGetCharactersListQuery } from '@/store/api/api-slice';

import { CustomButton } from '../custom-button/CustomButton';
import styles from './SearchForm.module.scss';

export function SearchForm(): ReactNode {
  const { getStoredValue, setStoredValue } = useLocalStorage<string>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const { page, name } = router.query;

  const pageParam = Number(page?.toString() || DEFAULT_PAGE);
  const nameParam = name?.toString() ?? '';

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
    if (searchTerm && Object.keys(router.query).length === 0) {
      inputRef.current!.value = searchTerm;
      void router.push({ query: { ...router.query, name: searchTerm } });
    } else if (searchTerm !== nameParam && Object.keys(router.query).length > 0) {
      updateSearchTerm(nameParam);
      inputRef.current!.value = nameParam;
    }
  }, [searchTerm, updateSearchTerm, nameParam, router]);

  useEffect(() => {
    if (!isDisabled) {
      inputRef.current?.focus();
    }
  }, [isDisabled]);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const inputSearchTerm = inputRef.current?.value.trim() ?? '';

    updateSearchTerm(inputSearchTerm);

    if (inputSearchTerm) {
      void router.push({ query: { ...router.query, name: inputSearchTerm, page: DEFAULT_PAGE.toString() } });
    } else {
      const { name: deletedName, ...rest } = router.query;

      void router.push({ query: { ...rest, page: DEFAULT_PAGE.toString() } });
    }
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
