import type { ReactNode } from 'react';

import styles from './styles.module.scss';

interface Props {
  children: ReactNode;
}

export function Main({ children }: Props): ReactNode {
  return (
    <main className={styles.main}>
      <div className={styles.container}>{children}</div>
    </main>
  );
}
