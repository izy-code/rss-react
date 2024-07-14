import { type ReactNode, useEffect, useState } from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

import { CustomButton } from '@/components/custom-button/CustomButton';

import styles from './ErrorPage.module.scss';

interface Props {
  errorBoundaryMessage: string | null;
}

export function ErrorPage({ errorBoundaryMessage }: Props): ReactNode {
  const routeError = useRouteError();
  const [errorMessage, setErrorMessage] = useState<string | null>(errorBoundaryMessage);

  useEffect(() => {
    if (routeError) {
      if (isRouteErrorResponse(routeError)) {
        setErrorMessage(routeError.statusText);
      } else if (routeError instanceof Error) {
        setErrorMessage(routeError.message);
      } else {
        setErrorMessage(null);
      }
    }
  }, [routeError]);

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
