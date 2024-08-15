import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { RoutePath } from '@/common/enums';

import styles from './MainPage.module.scss';

export function MainPage(): ReactNode {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Main page</h1>
        <nav className={styles.nav}>
          <Link to={RoutePath.UNCONTROLLED_FORM}>Uncontrolled form</Link>
          <Link to={RoutePath.REACT_HOOK_FORM}>React Hook Form</Link>
        </nav>
      </header>
      <main className={styles.main}>
        <p className={styles.text}>No forms submitted yet</p>
      </main>
    </div>
  );
}
