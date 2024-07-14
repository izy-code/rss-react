import clsx from 'clsx';
import type { ReactNode } from 'react';

import styles from './styles.module.scss';

export function Loader({ className }: { className?: string }): ReactNode {
  return (
    <div className={clsx(styles.loaderContainer, className)}>
      <div className={styles.loader} />
    </div>
  );
}
