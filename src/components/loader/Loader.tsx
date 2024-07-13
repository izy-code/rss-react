import type { ReactNode } from 'react';

import styles from './styles.module.scss';

export function Loader(): ReactNode {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader} />
    </div>
  );
}
