import type { ReactNode } from 'react';
import { useCallback, useRef, useState } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';

import { SearchParams } from '@/common/enums';
import { CardList } from '@/components/card-list/CardList';
import { ThrowErrorButton } from '@/components/error-button/ThrowErrorButton';
import { Header } from '@/components/header/Header';
import { SearchForm } from '@/components/search-form/SearchForm';
import { useLocalStorage } from '@/hooks/useLocalStorage';

import styles from './MainPage.module.scss';

export function MainPage(): ReactNode {
  const [searchParams, setSearchParams] = useSearchParams();
  const [storedValue, setStoredValue] = useLocalStorage();
  const [searchTerm, setSearchTerm] = useState<string>(storedValue);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastSearchTime, setLastSearchTime] = useState<Date | null>(null);
  const sectionRef = useRef(null);

  const detailsParam = searchParams.get(SearchParams.DETAILS);

  const handleSearch = useCallback(
    (term: string): void => {
      setStoredValue(term);
      setSearchTerm(term);
      setLastSearchTime(new Date());
    },
    [setStoredValue],
  );

  const handleLoadingState = useCallback((loading: boolean): void => {
    setIsLoading(loading);
  }, []);

  const handleListSectionClick = (evt: React.MouseEvent): void => {
    if (evt.target === sectionRef.current) {
      searchParams.delete(SearchParams.DETAILS);
      setSearchParams(searchParams);
    }
  };

  return (
    <div className={styles.page}>
      <Header>
        <SearchForm onSearch={handleSearch} initialTerm={searchTerm} isLoading={isLoading} />
        <ThrowErrorButton />
      </Header>
      <main className={styles.main}>
        <section className={styles.listSection} onClick={handleListSectionClick} ref={sectionRef}>
          <CardList
            searchTerm={searchTerm}
            onLoadingStateChange={handleLoadingState}
            lastSearchTime={lastSearchTime}
            isLoading={isLoading}
          />
        </section>
        {detailsParam && (
          <section className={styles.detailsSection}>
            <Outlet />
          </section>
        )}
      </main>
    </div>
  );
}
