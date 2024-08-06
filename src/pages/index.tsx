import { useRouter } from 'next/router';
import { type ReactNode, useEffect, useState } from 'react';

import { CardList } from '@/components/card-list/CardList';
import { Details } from '@/components/details/Details';
import { ThrowErrorButton } from '@/components/error-button/ThrowErrorButton';
import { Header } from '@/components/header/Header';
import { Loader } from '@/components/loader/Loader';
import { SearchForm } from '@/components/search-form/SearchForm';
import { ThemeButton } from '@/components/theme-button/ThemeButton';
import { DEFAULT_PAGE, getCharacterById, getCharactersList, getRunningQueriesThunk } from '@/store/api/api-slice';
import { wrapper } from '@/store/store';
import styles from '@/styles/Home.module.scss';

export const getServerSideProps = wrapper.getServerSideProps((store) => async (context): Promise<{ props: object }> => {
  const { name, page, details } = context.query;

  await store.dispatch(
    getCharactersList.initiate({
      searchTerm: name?.toString() || '',
      page: Number(page) || DEFAULT_PAGE,
    }),
  );

  if (details) {
    await store.dispatch(getCharacterById.initiate(details.toString()));
  }

  await Promise.all(store.dispatch(getRunningQueriesThunk()));

  return {
    props: {},
  };
});

export default function Home(): ReactNode {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { details } = router.query;

  const handleMainClick = (): void => {
    const { details: detailsParam, ...rest } = router.query;

    if (detailsParam) {
      void router.push({ query: rest });
    }
  };

  useEffect(() => {
    const onRouteChangeStart = (): void => {
      setIsLoading(true);
    };
    const onRouteChangeComplete = (): void => {
      setIsLoading(false);
    };
    router.events.on('routeChangeStart', onRouteChangeStart);
    router.events.on('routeChangeComplete', onRouteChangeComplete);
    router.events.on('routeChangeError', onRouteChangeComplete);

    return (): void => {
      router.events.off('routeChangeStart', onRouteChangeStart);
      router.events.off('routeChangeComplete', onRouteChangeComplete);
      router.events.off('routeChangeError', onRouteChangeComplete);
    };
  }, [router.events]);

  return (
    <div className={styles.page}>
      <Header>
        <SearchForm />
        <ThrowErrorButton />
        <ThemeButton />
      </Header>
      {isLoading ? (
        <Loader />
      ) : (
        <main className={styles.main} onClick={handleMainClick}>
          <section className={styles.listSection}>
            <CardList />
          </section>
          {details && (
            <section className={styles.detailsSection}>
              <Details />
            </section>
          )}
        </main>
      )}
    </div>
  );
}
