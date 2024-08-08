'use client';

import type { MouseEvent, ReactNode } from 'react';
import { useRef } from 'react';

import type { FetchCharacterListResult, FetchCharacterResult } from '@/api/api';
import { SearchParams } from '@/common/enums';
import { CardList } from '@/components/card-list/CardList';
import { Details } from '@/components/details/Details';
import { useQueries } from '@/hooks/useQueries';

import styles from './MainSection.module.scss';

export default function MainSection({
  cardListData,
  detailsData,
}: {
  cardListData: FetchCharacterListResult;
  detailsData: FetchCharacterResult;
}): ReactNode {
  const { details, removeSearchParam } = useQueries();

  const mainRef = useRef(null);
  const sectionRef = useRef(null);
  const listRef = useRef(null);

  const handleMainClick = (evt: MouseEvent): void => {
    const isTargetRef =
      evt.target === mainRef.current || evt.target === sectionRef.current || evt.target === listRef.current;

    if (details && isTargetRef) {
      removeSearchParam(SearchParams.DETAILS);
    }
  };

  return (
    <main className={styles.main} onClick={handleMainClick} ref={mainRef}>
      <section className={styles.listSection} ref={sectionRef}>
        <CardList characters={cardListData} ref={listRef} />
      </section>
      {details && (
        <section className={styles.detailsSection}>
          <Details character={detailsData} />
        </section>
      )}
    </main>
  );
}
