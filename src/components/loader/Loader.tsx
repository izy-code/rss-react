import type { ReactNode } from 'react';
import { Component } from 'react';

import styles from './styles.module.scss';

export class Loader extends Component {
  public render(): ReactNode {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader} />
      </div>
    );
  }
}
