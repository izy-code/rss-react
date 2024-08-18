import clsx from 'clsx';
import { type ReactNode, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { RoutePath } from '@/common/enums';
import { TileContent } from '@/components/tile-content/TileContent';
import { useAppSelector } from '@/hooks/store-hooks';

import styles from './MainPage.module.scss';

const NEW_TILE_TIMEOUT_MS = 3000;

export function MainPage(): ReactNode {
  const [isNewSubmit, setIsNewSubmit] = useState<boolean>(false);
  const formSubmits = useAppSelector((state) => state.formData);
  const locationState: unknown = useLocation().state;

  useEffect(() => {
    if (!locationState || typeof locationState !== 'boolean') {
      return;
    }

    setIsNewSubmit(locationState);

    const timeoutId = setTimeout(() => setIsNewSubmit(false), NEW_TILE_TIMEOUT_MS);

    return (): void => {
      clearTimeout(timeoutId);
    };
  }, [locationState]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Main page</h1>
        <nav className={styles.nav}>
          <Link className={styles.link} to={RoutePath.UNCONTROLLED_FORM}>
            Uncontrolled form
          </Link>
          <Link className={styles.link} to={RoutePath.REACT_HOOK_FORM}>
            React Hook Form
          </Link>
        </nav>
      </header>

      <main className={styles.main}>
        {formSubmits.length === 0 ? (
          <p className={styles.text}>No forms submitted yet</p>
        ) : (
          <ul className={styles.list}>
            {formSubmits.map((formSubmit, index) => (
              <li className={clsx(styles.listItem, isNewSubmit && index === 0 && styles.newTile)} key={index}>
                <TileContent tileData={formSubmit} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
