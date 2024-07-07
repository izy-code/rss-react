import type { ReactNode } from 'react';
import { Component } from 'react';

import styles from './styles.module.scss';

type Props = { children: ReactNode };

export class Main extends Component<Props> {
  public render(): ReactNode {
    const { children } = this.props;

    return (
      <main className={styles.main}>
        <div className={styles.container}>{children}</div>
      </main>
    );
  }
}
