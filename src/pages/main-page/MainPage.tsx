import { Outlet, useNavigation, useSearchParams } from '@remix-run/react';
import { type MouseEvent, type ReactNode, useRef } from 'react';

import type { FetchCharacterListResult } from '@/api/api';
import { DEFAULT_PAGE } from '@/api/api';
import { SearchParams } from '@/common/enums';
import { CardList } from '@/components/card-list/CardList';
import { ThrowErrorButton } from '@/components/error-button/ThrowErrorButton';
import { Header } from '@/components/header/Header';
import { Loader } from '@/components/loader/Loader';
import { SearchForm } from '@/components/search-form/SearchForm';
import { ThemeButton } from '@/components/theme-button/ThemeButton';

import styles from './MainPage.module.scss';

export function MainPage({ characters }: { characters: FetchCharacterListResult }): ReactNode {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();

  const mainRef = useRef(null);
  const sectionRef = useRef(null);
  const listRef = useRef(null);

  const searchTerm = searchParams.get(SearchParams.NAME) || '';
  const page = (Number(searchParams.get(SearchParams.PAGE)) || DEFAULT_PAGE).toString();
  const detailsParam = searchParams.get(SearchParams.DETAILS);

  let isCardListLoading = false;

  if (navigation.location) {
    const futureSearchParams = new URLSearchParams(navigation.location.search);
    const pageParam = futureSearchParams.get(SearchParams.PAGE);
    const searchTermParam = futureSearchParams.get(SearchParams.NAME) || '';

    isCardListLoading = page !== pageParam || searchTermParam !== searchTerm;
  }

  const handleMainClick = (evt: MouseEvent): void => {
    const isTargetRef =
      evt.target === mainRef.current || evt.target === sectionRef.current || evt.target === listRef.current;

    if (detailsParam && isTargetRef) {
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
      <main className={styles.main} onClick={handleMainClick} ref={mainRef}>
        <section className={styles.listSection} ref={sectionRef}>
          {isCardListLoading ? <Loader /> : <CardList characters={characters} ref={listRef} />}
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
