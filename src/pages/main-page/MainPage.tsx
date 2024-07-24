import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';
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
  const [searchParams, setSearchParams] = useSearchParams();

  const details = searchParams.get(SearchParams.DETAILS);

  const handleSearch = useCallback(
    (term: string): void => {
      setStoredValue(LocalStorageKeys.SEARCH, term);
      setSearchTerm(term);
    },
    [setStoredValue],
  );

  const handleMainClick = (evt: React.MouseEvent): void => {
    evt.stopPropagation();

    if (details) {
      searchParams.delete(SearchParams.DETAILS);
      setSearchParams(searchParams);
    }
  };

  const isDetailsSectionShown = Boolean(searchParams.get(SearchParams.DETAILS));

  return (
    <div className={styles.page}>
      <Header>
        <SearchForm initialSearchTerm={searchTerm} onSearch={handleSearch} />
        <ThrowErrorButton />
        <ThemeButton />
      </Header>
      <main className={styles.main} onClick={(evt) => handleMainClick(evt)}>
        <section className={styles.listSection}>
          <CardList searchTerm={searchTerm} />
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
