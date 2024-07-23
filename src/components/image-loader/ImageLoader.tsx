import clsx from 'clsx';
import { type ReactNode, useState } from 'react';

import placeholder from '@/assets/images/placeholder.jpeg';

import { Loader } from '../loader/Loader';
import styles from './ImageLoader.module.scss';

interface Props {
  imageSrc: string;
  imageAlt: string;
  secondaryColor?: boolean;
}

export function ImageLoader({ imageSrc, imageAlt, secondaryColor = false }: Props): ReactNode {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = (): void => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && (
        <div className={styles.placeholder}>
          <img className={styles.image} src={placeholder} alt="Placeholder" />
          <Loader className={styles.loader} secondaryColor={secondaryColor} />
        </div>
      )}
      <img
        className={clsx(styles.image, isLoading ? styles.hidden : '')}
        src={imageSrc}
        alt={imageAlt}
        onLoad={handleImageLoad}
      />
    </>
  );
}
