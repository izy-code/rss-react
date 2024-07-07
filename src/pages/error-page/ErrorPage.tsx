import classNames from 'classnames';
import type { ReactNode } from 'react';
import { Component } from 'react';

import styles from './styles.module.scss';

type Props = {
  errorMessage: string;
};

export class ErrorPage extends Component<Props> {
  private static handleReload = (): void => {
    window.location.reload();
  };

  public render(): ReactNode {
    const { errorMessage } = this.props;

    return (
      <main className={classNames('main', styles.main)}>
        <div className={styles.container}>
          <h1 className={styles.header}>Oops!</h1>
          <p className={styles.text}>Sorry, an unexpected error has occurred.</p>
          {errorMessage && (
            <>
              <p className={styles.errorDesc}>Error message:</p>
              <p className={styles.error}>{errorMessage}</p>
            </>
          )}
          <p className={styles.text}>Please try to refresh the page.</p>
          <button className={styles.reloadBtn} type="button" onClick={ErrorPage.handleReload}>
            Refresh the page
          </button>
        </div>
      </main>
    );
  }
}
