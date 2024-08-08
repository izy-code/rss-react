import type { ReactNode } from 'react';
import { forwardRef } from 'react';

import { type FetchCharacterListResult } from '@/api/api';
import { Card } from '@/components/card/Card';

import { Flyout } from '../flyout/Flyout';
import { Pagination } from '../pagination/Pagination';
import styles from './CardList.module.scss';

export const CardList = forwardRef<HTMLUListElement, { characters: FetchCharacterListResult }>(function CardList(
  { characters },
  listRef,
): ReactNode {
  let content: ReactNode = null;

  if (characters.status === 'error') {
    content = <div className={styles.message}>Characters list fetching problem</div>;
  } else if (characters.status === 'empty' || !characters.data) {
    content = <div className={styles.message}>No characters found</div>;
  } else {
    content = (
      <>
        <Pagination pageInfo={characters.data.info} />
        <ul className={styles.list} ref={listRef}>
          {characters.data.results.map((character) => (
            <Card key={character.id} character={character} />
          ))}
        </ul>
        <Flyout />
      </>
    );
  }

  return content;
});
