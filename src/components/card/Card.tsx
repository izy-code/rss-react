import clsx from 'clsx';
import { type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import type { CharacterData } from '@/api/types';
import { SearchParams } from '@/common/enums';

import { ImageLoader } from '../image-loader/ImageLoader';
import styles from './Card.module.scss';

interface Props {
  character: CharacterData;
}

export function Card({ character }: Props): ReactNode {
  const [searchParams] = useSearchParams();

  const isActive = searchParams.get(SearchParams.DETAILS) === character.id.toString();

  const getLinkPath = (): string => {
    const updatedSearchParams = new URLSearchParams(searchParams);

    updatedSearchParams.set(SearchParams.DETAILS, character.id.toString());

    return `?${updatedSearchParams.toString()}`;
  };

  return (
    <li className={styles.card}>
      <Link className={clsx(isActive ? styles.active : '', styles.link)} to={getLinkPath()}>
        <ImageLoader imageSrc={character.image} imageAlt={character.name} />
        <h2 className={styles.title}>{character.name}</h2>
      </Link>
    </li>
  );
}
