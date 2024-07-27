import clsx from 'clsx';
import { type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { SearchParams } from '@/common/enums';
import { useAppDispatch, useAppSelector } from '@/hooks/store-hooks';
import type { CharacterData } from '@/store/api/types';
import { selectFavoriteItemById, selectItem, unselectItem } from '@/store/favorite-items/favorite-items-slice';
import type { RootState } from '@/store/store';

import { ImageLoader } from '../image-loader/ImageLoader';
import styles from './Card.module.scss';

interface Props {
  character: CharacterData;
}

export function Card({ character }: Props): ReactNode {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const storeItemData = useAppSelector((state: RootState) => selectFavoriteItemById(state, character.id));

  const isActive = searchParams.get(SearchParams.DETAILS) === character.id.toString();

  const getLinkPath = (): string => {
    const updatedSearchParams = new URLSearchParams(searchParams);

    updatedSearchParams.set(SearchParams.DETAILS, character.id.toString());

    return `?${updatedSearchParams.toString()}`;
  };

  const handleListItemClick = (evt: React.MouseEvent): void => {
    evt.stopPropagation();
  };

  const handleCheckboxChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    if (evt.target.checked) {
      dispatch(selectItem(character));
    } else {
      dispatch(unselectItem(character.id));
    }
  };

  return (
    <li className={styles.card} onClick={(evt) => handleListItemClick(evt)}>
      <Link className={clsx(isActive ? styles.active : '', styles.link)} to={getLinkPath()}>
        <ImageLoader imageSrc={character.image} imageAlt={character.name} />
        <div className={styles.content}>
          <h2 className={styles.title}>{character.name}</h2>
          <input
            className={styles.checkbox}
            type="checkbox"
            checked={Boolean(storeItemData)}
            onChange={handleCheckboxChange}
            onClick={(evt) => handleListItemClick(evt)}
          />
        </div>
      </Link>
    </li>
  );
}
