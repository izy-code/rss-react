import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { FetchCharacterListResult } from '@/api/api';
import { DEFAULT_PAGE, fetchCharacters } from '@/api/api';
import { SearchParams } from '@/common/enums';
import { Card } from '@/components/card/Card';
import { Loader } from '@/components/loader/Loader';

import { Pagination } from '../pagination/Pagination';
import styles from './CardList.module.scss';

interface Props {
  searchTerm: string;
  lastSearchTime: Date | null;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const ANTI_FLICKER_DELAY = 500;

export function CardList({ searchTerm, lastSearchTime, isLoading, setIsLoading }: Props): ReactNode {
  const [isFetchError, setIsFetchError] = useState<boolean>(false);
  const [fetchResult, setFetchResult] = useState<FetchCharacterListResult>({ status: 'aborted' });
  const [searchParams, setSearchParams] = useSearchParams();
  const listRef = useRef(null);

  const currentPage = Number(searchParams.get(SearchParams.PAGE));

  const handleListClick = (evt: React.MouseEvent): void => {
    if (evt.target === listRef.current) {
      searchParams.delete(SearchParams.DETAILS);
      setSearchParams(searchParams);
    }
  };

  useEffect(() => {
    const updateCards = async (controller: AbortController): Promise<void> => {
      const loadingTimeout = setTimeout(() => {
        setIsLoading(true);
      }, ANTI_FLICKER_DELAY);
      setIsFetchError(false);

      try {
        const fetchCharactersResult = await fetchCharacters(searchTerm, controller, currentPage);

        setFetchResult(fetchCharactersResult);
      } catch (error) {
        setIsFetchError(true);
      } finally {
        clearTimeout(loadingTimeout);
        setIsLoading(false);
      }
    };

    const controller = new AbortController();

    void updateCards(controller);

    return (): void => {
      controller.abort();
    };
  }, [searchTerm, lastSearchTime, currentPage, setIsLoading]);

  useEffect(() => {
    if (!Number.isInteger(currentPage) || currentPage < DEFAULT_PAGE) {
      searchParams.set(SearchParams.PAGE, DEFAULT_PAGE.toString());
      setSearchParams(searchParams);
    }
  }, [currentPage, searchParams, setSearchParams]);

  if (isFetchError) {
    return <div className={styles.message}>Characters list fetching problem</div>;
  }

  if (isLoading || fetchResult.status === 'aborted') {
    return <Loader />;
  }

  if (fetchResult.status === 'empty' || !fetchResult.data) {
    return <div className={styles.message}>No characters found</div>;
  }

  return (
    <>
      <Pagination pageInfo={fetchResult.data.info} />
      <ul className={styles.list} ref={listRef} onClick={handleListClick}>
        {fetchResult.data.results.map((characterData) => (
          <Card key={characterData.id} character={characterData} />
        ))}
      </ul>
    </>
  );
}
