import type { ReactNode } from 'react';
import { useCallback, useRef, useState } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';

import { LocalStorageKeys, SearchParams } from '@/common/enums';
import { CardList } from '@/components/card-list/CardList';
import { ThrowErrorButton } from '@/components/error-button/ThrowErrorButton';
import { Header } from '@/components/header/Header';
import { SearchForm } from '@/components/search-form/SearchForm';
import { ThemeButton } from '@/components/theme-button/ThemeButton';
import { useLocalStorage } from '@/hooks/useLocalStorage';

import styles from './MainPage.module.scss';

export function MainPage(): ReactNode {
  const { getStoredValue, setStoredValue } = useLocalStorage<string>();
  const [searchTerm, setSearchTerm] = useState<string>(getStoredValue(LocalStorageKeys.SEARCH) || '');
  const [isCardListLoading, setIsCardListLoading] = useState<boolean>(false);
  const [lastSearchTime, setLastSearchTime] = useState<Date | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const sectionRef = useRef(null);
  const mainRef = useRef(null);

  const handleSearch = useCallback(
    (term: string): void => {
      setStoredValue(LocalStorageKeys.SEARCH, term);
      setSearchTerm(term);
      setLastSearchTime(new Date());
    },
    [setStoredValue],
  );

  const handleMainClick = (evt: React.MouseEvent): void => {
    if (evt.target === sectionRef.current || evt.target === mainRef.current) {
      searchParams.delete(SearchParams.DETAILS);
      setSearchParams(searchParams);
    }
  };

  const isDetailsSectionShown = Boolean(searchParams.get(SearchParams.DETAILS));

  return (
    <div className={styles.page}>
      <Header>
        <SearchForm initialSearchTerm={searchTerm} onSearch={handleSearch} isDisabled={isCardListLoading} />
        <ThrowErrorButton />
        <ThemeButton />
      </Header>
      <main className={styles.main} onClick={handleMainClick} ref={mainRef}>
        <section className={styles.listSection} ref={sectionRef}>
          <CardList
            searchTerm={searchTerm}
            lastSearchTime={lastSearchTime}
            isLoading={isCardListLoading}
            setIsLoading={setIsCardListLoading}
          />
        </section>
        {isDetailsSectionShown && (
          <section className={styles.detailsSection}>
            <Outlet />
          </section>
        )}
      </main>
    </div>
  );
}
