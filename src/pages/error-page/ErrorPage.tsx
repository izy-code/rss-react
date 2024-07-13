import type { ReactNode } from 'react';
import { Component } from 'react';

import { CustomButton } from '@/components/custom-button/CustomButton';

import styles from './styles.module.scss';

type Props = {
  errorMessage: string;
};

export class ErrorPage extends Component<Props> {
  private static handleRefresh = (): void => {
    window.location.reload();
  };

  public render(): ReactNode {
    const { errorMessage } = this.props;

    return (
      <main className={styles.main}>
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
          <CustomButton className={styles.refreshBtn} type="button" onClick={ErrorPage.handleRefresh}>
            Refresh the page
          </CustomButton>
        </div>
      </main>
    );
  }
}
