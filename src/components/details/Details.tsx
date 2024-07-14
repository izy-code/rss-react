import { type ReactNode, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { fetchCharacterById } from '@/api/api';
import type { Character } from '@/api/types';
import { SearchParams } from '@/common/enums';

import { CustomButton } from '../custom-button/CustomButton';
import { ImageLoader } from '../image-loader/ImageLoader';
import { Loader } from '../loader/Loader';
import styles from './Details.module.scss';

export function Details(): ReactNode {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [character, setCharacter] = useState<Partial<Character> | null>(null);
  const [isFetchError, setIsFetchError] = useState<boolean>(false);

  const detailsParam = searchParams.get(SearchParams.DETAILS);

  useEffect(() => {
    const controller = new AbortController();

    const updateCards = async (): Promise<void> => {
      setIsFetchError(false);
      setIsLoading(true);

      try {
        const data = await fetchCharacterById(+detailsParam!, controller);

        if (data) {
          setCharacter(data);
        } else {
          setCharacter(null);
        }
      } catch (error) {
        setIsFetchError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (detailsParam && Number.isInteger(+detailsParam)) {
      void updateCards();
    } else {
      setCharacter({ id: null });
    }

    return (): void => {
      controller.abort();
    };
  }, [detailsParam]);

  const handleButtonClick = (): void => {
    searchParams.delete(SearchParams.DETAILS);
    setSearchParams(searchParams);
  };

  if (isFetchError) {
    return <div className={styles.message}>Network connection problem</div>;
  }

  if (isLoading || !character) {
    return <Loader />;
  }

  if (character.id === null) {
    return <div className={styles.message}>No characters found</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <ImageLoader imageSrc={character.image!} imageAlt={character.name!} />
        <h2 className={styles.title}>{character.name}</h2>
        <div className={styles.propsContainer}>
          <p className={styles.prop}>
            <span className={styles.param}>Species:</span> {character.species}
          </p>
          <p className={styles.prop}>
            <span className={styles.param}>Status:</span> {character.status}
          </p>
          <p className={styles.prop}>
            <span className={styles.param}>Gender:</span> {character.gender}
          </p>
          <p className={styles.prop}>
            <span className={styles.param}>Episodes count:</span> {character.episode!.length}
          </p>
          <p className={styles.prop}>
            <span className={styles.param}>Origin:</span> {character.origin!.name}
          </p>
          <p className={styles.prop}>
            <span className={styles.param}>Location:</span> {character.location!.name}
          </p>
        </div>
      </div>
      <CustomButton variant="cancel" className={styles.button} onClick={handleButtonClick}>
        Close details
      </CustomButton>
    </div>
  );
}
