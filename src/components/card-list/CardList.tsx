import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { SearchParams } from '@/common/enums';
import { Card } from '@/components/card/Card';
import { Loader } from '@/components/loader/Loader';
import { DEFAULT_PAGE, useGetCharactersListQuery } from '@/store/api/api-slice';

import { Pagination } from '../pagination/Pagination';
import styles from './CardList.module.scss';

export function CardList(): ReactNode {
  const [searchParams, setSearchParams] = useSearchParams();
  const listRef = useRef(null);

  const pageParam = Number(searchParams.get(SearchParams.PAGE));
  const nameParam = searchParams.get(SearchParams.NAME) ?? '';

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
      searchParams.set(SearchParams.PAGE, DEFAULT_PAGE.toString());
      setSearchParams(searchParams);
    }
  }, [pageParam, searchParams, setSearchParams]);

  let content: ReactNode = null;

  if (isFetching) {
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
      </>
    );
  }

  return content;
}
