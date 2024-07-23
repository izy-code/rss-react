import clsx from 'clsx';
import type { ReactNode } from 'react';

import styles from './Loader.module.scss';

export function Loader({
  className,
  secondaryColor = false,
}: {
  className?: string;
  secondaryColor?: boolean;
}): ReactNode {
  return (
    <div className={clsx(styles.loaderContainer, className)}>
      <h2 className="visually-hidden">Loading...</h2>
      <div className={clsx(styles.loader, secondaryColor && styles.secondary)} />
    </div>
  );
}
