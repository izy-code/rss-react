import clsx from 'clsx';
import { type ReactNode, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import type { Character } from '@/api/types';
import placeholder from '@/assets/images/placeholder.jpeg';

import { Loader } from '../loader/Loader';
import styles from './Card.module.scss';

interface Props {
  character: Character;
}

export function Card({ character }: Props): ReactNode {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = (): void => {
    setIsLoading(false);
  };

  const updatedSearchParams = new URLSearchParams(searchParams);

  updatedSearchParams.delete('details');

  const linkPath = `?${updatedSearchParams.toString()}&details=${character.id}`;

  const isActive = searchParams.get('details') === String(character.id);

  return (
    <li className={styles.card}>
      <Link className={clsx(isActive ? styles.active : '', styles.link)} to={linkPath}>
        {isLoading && (
          <div className={styles.placeholder}>
            <img className={styles.image} src={placeholder} alt="Placeholder" />
            <Loader className={styles.loader} />
          </div>
        )}
        <img
          className={clsx(styles.image, isLoading ? styles.hidden : '')}
          src={character.image}
          alt={character.name}
          onLoad={handleImageLoad}
        />
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
            <span className={styles.param}>Episodes count:</span> {character.episode.length}
          </p>
          <p className={styles.prop}>
            <span className={styles.param}>Origin:</span> {character.origin.name}
          </p>
          <p className={styles.prop}>
            <span className={styles.param}>Location:</span> {character.location.name}
          </p>
        </div>
      </Link>
    </li>
  );
}
