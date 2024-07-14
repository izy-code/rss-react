import clsx from 'clsx';
import type { ReactNode } from 'react';

import styles from './Loader.module.scss';

export function Loader({ className }: { className?: string }): ReactNode {
  return (
    <div className={clsx(styles.loaderContainer, className)} data-testid="loader">
      <div className={styles.loader} />
    </div>
  );
}
