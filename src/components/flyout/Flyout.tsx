import clsx from 'clsx';
import type { ReactNode } from 'react';

import { useAppDispatch, useAppSelector } from '@/hooks/store-hooks';
import { selectAllFavoriteItems, unselectAll } from '@/store/favorite-items/favorite-items-slice';
import type { DataObject } from '@/utils/utils';
import { getCsvObjectUrl } from '@/utils/utils';

import { CustomButton } from '../custom-button/CustomButton';
import styles from './Flyout.module.scss';

export function Flyout(): ReactNode {
  const dispatch = useAppDispatch();
  const favoriteItems = useAppSelector(selectAllFavoriteItems);
  const itemCount = favoriteItems.length;
  const isShown = itemCount > 0;

  const handleUnselectAll = (): void => {
    dispatch(unselectAll());
  };

  return (
    <div className={clsx(styles.flyout, isShown && styles.show)} aria-hidden={!isShown}>
      <p className={styles.counter}>Items selected: {itemCount}</p>
      <div className={styles.buttonsContainer}>
        <CustomButton variant="cancel" onClick={handleUnselectAll}>
          Unselect all
        </CustomButton>
        <a
          className={styles.link}
          href={isShown ? getCsvObjectUrl(favoriteItems as DataObject[]) : '#'}
          download={`${itemCount}_characters.csv`}
        >
          Download
        </a>
      </div>
    </div>
  );
}
