import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { CustomButton } from '@/components/custom-button/CustomButton';

import styles from './Page404.module.scss';

export function Page404(): ReactNode {
  const navigate = useNavigate();

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.text}>The page you requested was not found.</p>
        <div className={styles.buttons}>
          <CustomButton variant="tertiary" onClick={() => navigate(-1)}>
            Previous page
          </CustomButton>
          <CustomButton variant="tertiary" onClick={() => navigate('/')}>
            Home page
          </CustomButton>
        </div>
      </div>
    </main>
  );
}
