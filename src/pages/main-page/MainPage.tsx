import { Outlet, useSearchParams } from '@remix-run/react';
import type { ReactNode } from 'react';

import { SearchParams } from '@/common/enums';
import { CardList } from '@/components/card-list/CardList';
import { ThrowErrorButton } from '@/components/error-button/ThrowErrorButton';
import { Header } from '@/components/header/Header';
import { SearchForm } from '@/components/search-form/SearchForm';
import { ThemeButton } from '@/components/theme-button/ThemeButton';

import styles from './MainPage.module.scss';

export function MainPage(): ReactNode {
  const [searchParams, setSearchParams] = useSearchParams();

  const detailsParam = searchParams.get(SearchParams.DETAILS);

  const handleMainClick = (): void => {
    if (detailsParam) {
      searchParams.delete(SearchParams.DETAILS);
      setSearchParams(searchParams);
    }
  };

  return (
    <div className={styles.page}>
      <Header>
        <SearchForm />
        <ThrowErrorButton />
        <ThemeButton />
      </Header>
      <main className={styles.main} onClick={handleMainClick}>
        <section className={styles.listSection}>
          <CardList />
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
