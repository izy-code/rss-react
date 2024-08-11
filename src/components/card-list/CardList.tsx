import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { forwardRef } from 'react';

import { Card } from '@/components/card/Card';
import { DEFAULT_PAGE, useGetCharactersListQuery } from '@/store/api/api-slice';

import { Flyout } from '../flyout/Flyout';
import { Pagination } from '../pagination/Pagination';
import styles from './CardList.module.scss';

export const CardList = forwardRef<HTMLUListElement>(function CardList(_, listRef): ReactNode {
  const router = useRouter();

  const { page, name } = router.query;

  const pageParam = Number(page?.toString() || DEFAULT_PAGE);
  const nameParam = name?.toString() ?? '';

  const {
    data: characterListData,
    isSuccess,
    isError,
    error,
  } = useGetCharactersListQuery({
    searchTerm: nameParam,
    page: pageParam,
  });

  let content: ReactNode = null;

  if (isError) {
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
});
