import type { ReactNode } from 'react';

import styles from './Header.module.scss';

interface Props {
  children: ReactNode;
}

export function Header({ children }: Props): ReactNode {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className="visually-hidden">Rick and Morty characters</h1>
        {children}
      </div>
    </header>
  );
}
