import type { FormEvent, ReactNode } from 'react';
import { useEffect, useRef } from 'react';

import { CustomButton } from '../custom-button/CustomButton';
import styles from './styles.module.scss';

interface Props {
  onSearch: (term: string) => void;
  initialTerm: string;
  isLoading: boolean;
}

export function SearchForm({ onSearch, initialTerm, isLoading }: Props): ReactNode {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (event.target instanceof HTMLFormElement) {
      const formData = new FormData(event.target);
      onSearch(formData.get('search')?.toString().trim() || '');
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
        name="search"
        disabled={isLoading}
        autoComplete="off"
      />
      <CustomButton type="submit" variant="secondary" isDisabled={isLoading}>
        Search
      </CustomButton>
    </form>
  );
}
