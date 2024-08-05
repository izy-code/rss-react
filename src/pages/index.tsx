import { useRouter } from 'next/router';
import type { ReactNode } from 'react';

import { CardList } from '@/components/card-list/CardList';
import { Details } from '@/components/details/Details';
import { ThrowErrorButton } from '@/components/error-button/ThrowErrorButton';
import { Header } from '@/components/header/Header';
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

  const { details } = router.query;

  const handleMainClick = (): void => {
    const { details: detailsParam, ...rest } = router.query;

    if (detailsParam) {
      void router.push({ query: rest });
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
        {details && (
          <section className={styles.detailsSection}>
            <Details />
          </section>
        )}
      </main>
    </div>
  );
}
