import type { ReactNode } from 'react';

import { CustomButton } from '@/components/custom-button/CustomButton';

import styles from './ErrorPage.module.scss';

interface Props {
  errorMessage: string;
}

export function ErrorPage({ errorMessage }: Props): ReactNode {
  const handleRefresh = (): void => {
    window.location.reload();
  };

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
        <CustomButton className={styles.refreshBtn} type="button" onClick={handleRefresh}>
          Refresh the page
        </CustomButton>
      </div>
    </main>
  );
}
