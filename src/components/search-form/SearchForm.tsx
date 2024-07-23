import type { FormEvent, ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { SearchParams } from '@/common/enums';

import { CustomButton } from '../custom-button/CustomButton';
import styles from './SearchForm.module.scss';

interface Props {
  onSearch: (term: string) => void;
  initialSearchTerm: string;
  isDisabled: boolean;
}

export function SearchForm({ onSearch, initialSearchTerm, isDisabled }: Props): ReactNode {
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isDisabled) {
      inputRef.current?.focus();
    }
  }, [isDisabled]);

  useEffect(() => {
    const urlSearchTerm = searchParams.get(SearchParams.NAME) ?? '';

    if (inputRef.current) {
      inputRef.current.value = urlSearchTerm;
    }

    if (initialSearchTerm !== urlSearchTerm) {
      onSearch(urlSearchTerm);
    }
  }, [searchParams, onSearch, initialSearchTerm]);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const inputSearchTerm = inputRef.current?.value.trim() ?? '';

    onSearch(inputSearchTerm);

    if (inputSearchTerm) {
      searchParams.set(SearchParams.NAME, inputSearchTerm);
      searchParams.delete(SearchParams.PAGE);
      setSearchParams(searchParams);
    } else {
      searchParams.delete(SearchParams.NAME);
      searchParams.delete(SearchParams.PAGE);
      setSearchParams(searchParams);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        className={styles.input}
        type="search"
        placeholder="Enter character name…"
        defaultValue={initialSearchTerm}
        disabled={isDisabled}
        autoComplete="off"
      />
      <CustomButton type="submit" variant="secondary" disabled={isDisabled}>
        Search
      </CustomButton>
    </form>
  );
}
