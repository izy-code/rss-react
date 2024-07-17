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
    <div className={clsx(styles.loaderContainer, className)} data-testid="loader">
      <div className={clsx(styles.loader, secondaryColor && styles.secondary)} />
    </div>
  );
}
