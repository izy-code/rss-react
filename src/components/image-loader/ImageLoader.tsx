import clsx from 'clsx';
import Image from 'next/image';
import { type ReactNode, useState } from 'react';

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
          <Image
            className={clsx(styles.image, styles.placeholderImage)}
            src="/placeholder.svg"
            alt="Placeholder"
            width="300"
            height="300"
            placeholder="blur"
            blurDataURL={imageSrc}
          />
          <Loader className={styles.loader} secondaryColor={secondaryColor} />
        </div>
      )}
      <Image
        className={clsx(styles.image, isLoading ? styles.hidden : '')}
        src={imageSrc}
        alt={imageAlt}
        onLoad={handleImageLoad}
        width="300"
        height="300"
        placeholder="blur"
        blurDataURL={imageSrc}
      />
    </>
  );
}
