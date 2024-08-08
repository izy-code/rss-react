import { type ReactNode } from 'react';

import type { FetchCharacterResult } from '@/api/api';
import { SearchParams } from '@/common/enums';
import { useQueries } from '@/hooks/useQueries';

import { CustomButton } from '../custom-button/CustomButton';
import { ImageLoader } from '../image-loader/ImageLoader';
import { Loader } from '../loader/Loader';
import styles from './Details.module.scss';

export function Details({ character }: { character: FetchCharacterResult }): ReactNode {
  const { details, removeSearchParam } = useQueries();

  const handleButtonClick = (): void => {
    if (details) {
      removeSearchParam(SearchParams.DETAILS);
    }
  };

  if (!character) {
    return <Loader secondaryColor className={styles.loader} />;
  }

  if (character.status === 'error' || !Number.isInteger(+details)) {
    return <div className={styles.message}>Character details fetching problem</div>;
  }

  if (character.status === 'empty' || !character.data) {
    return <div className={styles.message}>No character found</div>;
  }

  const characterData = character.data;
  const characterProps = {
    Species: characterData.species,
    Status: characterData.status,
    Gender: characterData.gender,
    'Episodes count': characterData.episode.length,
    Origin: characterData.origin.name,
    Location: characterData.location.name,
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <ImageLoader imageSrc={characterData.image} imageAlt={characterData.name} secondaryColor />
        <h2 className={styles.title}>{characterData.name}</h2>
        <dl className={styles.descriptionList}>
          {Object.entries(characterProps).map(([param, value]) => (
            <div className={styles.descriptionItem} key={param}>
              <dt className={styles.descriptionTerm}>{`${param}: `}</dt>
              <dd className={styles.descriptionDetail}>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <CustomButton variant="cancel" className={styles.button} onClick={handleButtonClick}>
        Close details
      </CustomButton>
    </div>
  );
}
