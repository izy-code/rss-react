import type { ReactNode } from 'react';
import { Component } from 'react';

import styles from './styles.module.scss';

type Props = { children: ReactNode };

export class Header extends Component<Props> {
  public render(): ReactNode {
    const { children } = this.props;

    return (
      <header className={styles.header}>
        <div className={styles.container}>
          <h1 className="visually-hidden">Rick and Morty characters</h1>
          {children}
        </div>
      </header>
    );
  }
}
