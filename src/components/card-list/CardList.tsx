import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

import { SearchParams } from '@/common/enums';
import { Card } from '@/components/card/Card';
import { Loader } from '@/components/loader/Loader';
import { DEFAULT_PAGE, useGetCharactersListQuery } from '@/store/api/api-slice';

import { Flyout } from '../flyout/Flyout';
import { Pagination } from '../pagination/Pagination';
import styles from './CardList.module.scss';

export function CardList(): ReactNode {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const listRef = useRef(null);

  const { page, name } = router.query;

  const pageParam = Number(page?.toString() || DEFAULT_PAGE);
  const nameParam = name?.toString() ?? '';

  const {
    data: characterListData,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetCharactersListQuery({
    searchTerm: nameParam,
    page: pageParam,
  });

  useEffect(() => {
    if (!Number.isInteger(pageParam) || pageParam < DEFAULT_PAGE) {
      void router.push({ query: { ...router.query, page: DEFAULT_PAGE.toString() } });
    }
  }, [pageParam, router]);

  useEffect(() => {
    const onRouteChangeStart = (url: string): void => {
      const urlParams = new URL(url, window.location.href).searchParams;
      const newPage = urlParams.get(SearchParams.PAGE);
      const newName = urlParams.get(SearchParams.NAME);

      if (newPage !== page?.toString() || newName !== name?.toString()) {
        setIsLoading(true);
      }
    };
    const onRouteChangeEnd = (): void => {
      setIsLoading(false);
    };

    router.events.on('routeChangeStart', onRouteChangeStart);
    router.events.on('routeChangeComplete', onRouteChangeEnd);
    router.events.on('routeChangeError', onRouteChangeEnd);

    return (): void => {
      router.events.off('routeChangeStart', onRouteChangeStart);
      router.events.off('routeChangeComplete', onRouteChangeEnd);
      router.events.off('routeChangeError', onRouteChangeEnd);
    };
  }, [page, name, router]);

  let content: ReactNode = null;

  if (isLoading || isFetching) {
    content = <Loader />;
  } else if (isError) {
    if ('status' in error && error.status === 404) {
      content = <div className={styles.message}>No characters found</div>;
    } else {
      content = <div className={styles.message}>Characters list fetching problem</div>;
    }
  } else if (isSuccess && characterListData) {
    content = (
      <>
        <Pagination pageInfo={characterListData.info} />
        <ul className={styles.list} ref={listRef}>
          {characterListData.results.map((characterData) => (
            <Card key={characterData.id} character={characterData} />
          ))}
        </ul>
        <Flyout />
      </>
    );
  }

  return content;
}
