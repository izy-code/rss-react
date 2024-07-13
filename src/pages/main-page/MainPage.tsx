import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';

import { CardList } from '@/components/card-list/CardList';
import { ThrowErrorButton } from '@/components/error-button/ThrowErrorButton';
import { Header } from '@/components/header/Header';
import { Main } from '@/components/main/Main';
import { SearchForm } from '@/components/search-form/SearchForm';

import styles from './styles.module.scss';

const LOCAL_STORAGE_KEY = 'izy-search-term-task-1';

export function MainPage(): ReactNode {
  const [searchTerm, setSearchTerm] = useState<string>(localStorage.getItem(LOCAL_STORAGE_KEY) || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastSearchTime, setLastSearchTime] = useState<Date | null>(null);

  const handleSearch = (term: string): void => {
    localStorage.setItem(LOCAL_STORAGE_KEY, term);
    setSearchTerm(term);
    setLastSearchTime(new Date());
  };

  const handleLoadingState = useCallback((loading: boolean): void => {
    setIsLoading(loading);
  }, []);

  return (
    <div className={styles.page}>
      <Header>
        <SearchForm onSearch={handleSearch} initialTerm={searchTerm} isLoading={isLoading} />
        <ThrowErrorButton />
      </Header>
      <Main>
        <CardList
          searchTerm={searchTerm}
          onLoadingStateChange={handleLoadingState}
          lastSearchTime={lastSearchTime}
          isLoading={isLoading}
        />
      </Main>
    </div>
  );
}
