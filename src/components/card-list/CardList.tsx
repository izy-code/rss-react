import type { ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { DEFAULT_PAGE, fetchCharacters } from '@/api/api';
import type { Character, Info } from '@/api/types';
import { SearchParams } from '@/common/enums';
import { Card } from '@/components/card/Card';
import { Loader } from '@/components/loader/Loader';

import { Pagination } from '../pagination/Pagination';
import styles from './CardList.module.scss';

interface Props {
  searchTerm: string;
  onLoadingStateChange: (isLoading: boolean) => void;
  lastSearchTime: Date | null;
  isLoading: boolean;
}

export function CardList({ searchTerm, onLoadingStateChange, lastSearchTime, isLoading }: Props): ReactNode {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cards, setCards] = useState<Character[] | null>(null);
  const [pageInfo, setPageInfo] = useState<Info | null>(null);
  const [isFetchError, setIsFetchError] = useState<boolean>(false);

  const currentPage = Number(searchParams.get('page'));

  useEffect(() => {
    const controller = new AbortController();

    const updateCards = async (): Promise<void> => {
      setIsFetchError(false);
      onLoadingStateChange(true);

      try {
        const data = await fetchCharacters(searchTerm, controller, currentPage);

        if (data && data.results.length > 0) {
          setCards(data.results);
          setPageInfo(data.info!);
        } else if (data && data.results.length === 0) {
          setCards([]);
          setPageInfo(null);
        } else {
          setCards(null);
        }
      } catch (error) {
        setIsFetchError(true);
      } finally {
        onLoadingStateChange(false);
      }
    };

    void updateCards();

    return (): void => {
      controller.abort();
    };
  }, [lastSearchTime, searchTerm, onLoadingStateChange, currentPage]);

  useEffect(() => {
    if (Number.isNaN(currentPage) || !Number.isInteger(currentPage) || currentPage < DEFAULT_PAGE) {
      searchParams.set(SearchParams.PAGE, String(DEFAULT_PAGE));
      setSearchParams(searchParams);
    }
  }, [pageInfo, currentPage, searchParams, setSearchParams]);

  const handlePageChange = useCallback(
    (pageNumber: number): void => {
      searchParams.set(SearchParams.PAGE, String(pageNumber));
      setSearchParams(searchParams);
    },
    [setSearchParams, searchParams],
  );

  if (isFetchError) {
    return <div className={styles.message}>Network connection problem</div>;
  }

  if (isLoading || !cards) {
    return <Loader />;
  }

  if (cards && cards.length === 0) {
    return <div className={styles.message}>No characters found</div>;
  }

  return (
    <>
      <Pagination pageInfo={pageInfo!} currentPage={currentPage} onPageChange={handlePageChange} />
      <ul className={styles.list}>
        {cards.map((card) => (
          <Card key={card.id} character={card} />
        ))}
      </ul>
    </>
  );
}
