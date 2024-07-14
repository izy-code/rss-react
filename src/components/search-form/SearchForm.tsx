import type { FormEvent, ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { SearchParams } from '@/common/enums';

import { CustomButton } from '../custom-button/CustomButton';
import styles from './SearchForm.module.scss';

interface Props {
  onSearch: (term: string) => void;
  initialTerm: string;
  isLoading: boolean;
}

export function SearchForm({ onSearch, initialTerm, isLoading }: Props): ReactNode {
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    const search = searchParams.get(SearchParams.NAME) ?? '';

    if (inputRef.current) {
      inputRef.current.value = search;
    }
  }, [searchParams]);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const searchTerm = inputRef.current?.value.trim() ?? '';

    onSearch(searchTerm);

    if (searchTerm) {
      setSearchParams((prev) => ({ ...prev, [SearchParams.NAME]: searchTerm }));
    } else {
      setSearchParams((prev) => {
        prev.delete(SearchParams.NAME);

        return prev;
      });
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        className={styles.input}
        type="search"
        placeholder="Enter character name…"
        defaultValue={initialTerm}
        disabled={isLoading}
        autoComplete="off"
      />
      <CustomButton type="submit" variant="secondary" disabled={isLoading}>
        Search
      </CustomButton>
    </form>
  );
}
