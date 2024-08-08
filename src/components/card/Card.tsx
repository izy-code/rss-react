import clsx from 'clsx';
import Link from 'next/link';
import { type ChangeEvent, type ReactNode } from 'react';

import type { CharacterData } from '@/api/types';
import { useAppDispatch, useAppSelector } from '@/hooks/store-hooks';
import { useQueries } from '@/hooks/useQueries';
import { selectFavoriteItemById, selectItem, unselectItem } from '@/store/favorite-items/favorite-items-slice';
import type { RootState } from '@/store/store';

import { ImageLoader } from '../image-loader/ImageLoader';
import styles from './Card.module.scss';

interface Props {
  character: CharacterData;
}

export function Card({ character }: Props): ReactNode {
  const { details, queryParams } = useQueries();
  const dispatch = useAppDispatch();
  const storeItemData = useAppSelector((state: RootState) => selectFavoriteItemById(state, character.id));

  const isActive = details && details === character.id.toString();
  const newHref = `?${new URLSearchParams({ ...Object.fromEntries(queryParams), details: character.id.toString() }).toString()}`;

  const handleCheckboxChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    if (evt.target.checked) {
      dispatch(selectItem(character));
    } else {
      dispatch(unselectItem(character.id));
    }
  };

  return (
    <li className={styles.card}>
      <Link className={clsx(isActive ? styles.active : '', styles.link)} href={newHref} scroll={false}>
        <ImageLoader imageSrc={character.image} imageAlt={character.name} />
        <div className={styles.content}>
          <h2 className={styles.title}>{character.name}</h2>
          <input
            className={styles.checkbox}
            type="checkbox"
            checked={Boolean(storeItemData)}
            onChange={handleCheckboxChange}
            onClick={(evt) => evt.stopPropagation()}
          />
        </div>
      </Link>
    </li>
  );
}
