import { type ReactNode, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { FetchCharacterResult } from '@/api/api';
import { fetchCharacterById } from '@/api/api';
import { SearchParams } from '@/common/enums';

import { CustomButton } from '../custom-button/CustomButton';
import { ImageLoader } from '../image-loader/ImageLoader';
import { Loader } from '../loader/Loader';
import styles from './Details.module.scss';

const ANTI_FLICKER_DELAY = 500;

export function Details(): ReactNode {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchError, setIsFetchError] = useState<boolean>(false);
  const [fetchResult, setFetchResult] = useState<FetchCharacterResult>({ status: 'aborted' });
  const [searchParams, setSearchParams] = useSearchParams();

  const detailsParam = searchParams.get(SearchParams.DETAILS);

  const handleButtonClick = (): void => {
    searchParams.delete(SearchParams.DETAILS);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    const updateCards = async (controller: AbortController, id: string): Promise<void> => {
      const loadingTimeout = setTimeout(() => {
        setIsLoading(true);
      }, ANTI_FLICKER_DELAY);
      setIsFetchError(false);

      try {
        const fetchCharacterResult = await fetchCharacterById(id, controller);

        setFetchResult(fetchCharacterResult);
      } catch (error) {
        setIsFetchError(true);
      } finally {
        clearTimeout(loadingTimeout);
        setIsLoading(false);
      }
    };

    const controller = new AbortController();

    if (detailsParam && Number.isInteger(+detailsParam)) {
      void updateCards(controller, detailsParam);
    } else {
      setFetchResult({ status: 'empty' });
    }

    return (): void => {
      controller.abort();
    };
  }, [detailsParam]);

  if (isFetchError) {
    return <div className={styles.message}>Character details fetching problem</div>;
  }

  if (isLoading || fetchResult.status === 'aborted') {
    return <Loader secondaryColor className={styles.loader} />;
  }

  if (fetchResult.status === 'empty' || !fetchResult.data) {
    return <div className={styles.message}>No character found</div>;
  }

  const character = fetchResult.data;
  const characterProps = {
    Species: character.species,
    Status: character.status,
    Gender: character.gender,
    'Episodes count': character.episode.length,
    Origin: character.origin.name,
    Location: character.location.name,
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <ImageLoader imageSrc={character.image} imageAlt={character.name} secondaryColor />
        <h2 className={styles.title}>{character.name}</h2>
        <div className={styles.propsContainer}>
          {Object.entries(characterProps).map(([param, value]) => (
            <p key={param} className={styles.prop}>
              <span className={styles.param}>{param}:</span> {value}
            </p>
          ))}
        </div>
      </div>
      <CustomButton variant="cancel" className={styles.button} onClick={handleButtonClick}>
        Close details
      </CustomButton>
    </div>
  );
}
