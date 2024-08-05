import { useRouter } from 'next/router';
import { type ReactNode, useEffect, useState } from 'react';

import { SearchParams } from '@/common/enums';
import { useGetCharacterByIdQuery } from '@/store/api/api-slice';

import { CustomButton } from '../custom-button/CustomButton';
import { ImageLoader } from '../image-loader/ImageLoader';
import { Loader } from '../loader/Loader';
import styles from './Details.module.scss';

export function Details(): ReactNode {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { details } = router.query;

  const detailsParam = details?.toString() || 'no-details';

  const { data: characterData, isFetching, isSuccess, isError, error } = useGetCharacterByIdQuery(detailsParam);

  const handleButtonClick = (): void => {
    const { details: deletedDetails, ...rest } = router.query;

    if (detailsParam) {
      void router.push({ query: rest });
    }
  };

  useEffect(() => {
    const onRouteChangeStart = (url: string): void => {
      const urlParams = new URL(url, window.location.href).searchParams;
      const newDetails = urlParams.get(SearchParams.DETAILS);

      if (newDetails !== detailsParam) {
        setIsLoading(true);
      }
    };
    const onRouteChangeEnd = (): void => {
      setIsLoading(false);
    };

    router.events.on('routeChangeStart', onRouteChangeStart);
    router.events.on('routeChangeComplete', onRouteChangeEnd);
    router.events.on('routeChangeError', onRouteChangeEnd);

    return (): void => {
      router.events.off('routeChangeStart', onRouteChangeStart);
      router.events.off('routeChangeComplete', onRouteChangeEnd);
      router.events.off('routeChangeError', onRouteChangeEnd);
    };
  }, [detailsParam, router]);

  let content: ReactNode = null;

  if (isLoading || isFetching) {
    content = <Loader secondaryColor className={styles.loader} />;
  } else if (isError) {
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
