import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { CardList } from '@/components/card-list/CardList';
import { ThrowErrorButton } from '@/components/error-button/ThrowErrorButton';
import { Header } from '@/components/header/Header';
import { SearchForm } from '@/components/search-form/SearchForm';
import { useLocalStorage } from '@/hooks/useLocalStorage';

import styles from './MainPage.module.scss';

export function MainPage(): ReactNode {
  const [storedValue, setStoredValue] = useLocalStorage();
  const [searchTerm, setSearchTerm] = useState<string>(storedValue);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastSearchTime, setLastSearchTime] = useState<Date | null>(null);

  const handleSearch = (term: string): void => {
    setStoredValue(term);
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
      <main className={styles.main}>
        <section className={styles.listSection}>
          <CardList
            searchTerm={searchTerm}
            onLoadingStateChange={handleLoadingState}
            lastSearchTime={lastSearchTime}
            isLoading={isLoading}
          />
        </section>
        <section className={styles.detailsSection}>
          <Outlet />
        </section>
      </main>
    </div>
  );
}
