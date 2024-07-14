import type { ReactNode } from 'react';

import type { Info } from '@/api/types';

import { CustomButton } from '../custom-button/CustomButton';
import styles from './Pagination.module.scss';

interface Props {
  currentPage: number;
  pageInfo: Info;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, pageInfo, onPageChange }: Props): ReactNode {
  return (
    <div className={styles.container}>
      <CustomButton
        className={styles.button}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </CustomButton>
      <p className={styles.text}>{`Page ${currentPage} of ${pageInfo.pages}`}</p>
      <CustomButton
        className={styles.button}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === pageInfo.pages}
      >
        Next
      </CustomButton>
    </div>
  );
}
