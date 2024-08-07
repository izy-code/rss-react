import { useRouter } from 'next/router';
import { type ReactNode } from 'react';

import { useGetCharacterByIdQuery } from '@/store/api/api-slice';

import { CustomButton } from '../custom-button/CustomButton';
import { ImageLoader } from '../image-loader/ImageLoader';
import styles from './Details.module.scss';

export function Details(): ReactNode {
  const router = useRouter();
  const { details } = router.query;

  const detailsParam = details?.toString() || 'no-details';

  const {
    data: characterData,
    isSuccess,
    isError,
    error,
  } = useGetCharacterByIdQuery(detailsParam, {
    skip: !details,
  });

  const handleButtonClick = (): void => {
    const { details: removedDetails, ...rest } = router.query;

    if (removedDetails) {
      void router.push({ query: rest }, undefined, { shallow: true, scroll: false });
    }
  };

  let content: ReactNode = null;

  if (isError) {
    if (!Number.isInteger(+detailsParam) || ('status' in error && error.status === 404)) {
      content = <div className={styles.message}>No character found</div>;
    } else {
      content = <div className={styles.message}>Character details fetching problem</div>;
    }
  } else if (isSuccess && characterData) {
    const characterProps = {
      Species: characterData.species,
      Status: characterData.status,
      Gender: characterData.gender,
      'Episodes count': characterData.episode.length,
      Origin: characterData.origin.name,
      Location: characterData.location.name,
    };

    content = (
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

  return content;
}
