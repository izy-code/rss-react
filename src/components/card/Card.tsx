import clsx from 'clsx';
import { type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import type { Character } from '@/api/types';

import { ImageLoader } from '../image-loader/ImageLoader';
import styles from './Card.module.scss';

interface Props {
  character: Character;
}

export function Card({ character }: Props): ReactNode {
  const [searchParams] = useSearchParams();

  const updatedSearchParams = new URLSearchParams(searchParams);

  updatedSearchParams.delete('details');

  const linkPath = `?${updatedSearchParams.toString()}&details=${character.id}`;

  const isActive = searchParams.get('details') === String(character.id);

  return (
    <li className={styles.card}>
      <Link className={clsx(isActive ? styles.active : '', styles.link)} to={linkPath}>
        <ImageLoader imageSrc={character.image} imageAlt={character.name} />
        <h2 className={styles.title}>{character.name}</h2>
      </Link>
    </li>
  );
}
