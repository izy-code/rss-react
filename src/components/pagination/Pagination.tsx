import { useRouter } from 'next/router';
import { type ReactNode } from 'react';

import { DEFAULT_PAGE } from '@/store/api/api-slice';
import type { CharacterListInfo } from '@/store/api/types';

import { CustomButton } from '../custom-button/CustomButton';
import styles from './Pagination.module.scss';

interface Props {
  pageInfo: CharacterListInfo;
}

export function Pagination({ pageInfo }: Props): ReactNode {
  const router = useRouter();
  const { page } = router.query;

  const currentPage = Number(page?.toString() || DEFAULT_PAGE);

  const handlePageChange = (pageNumber: number): void => {
    void router.push({ query: { ...router.query, page: pageNumber.toString() } });
  };

  const handleButtonClick = (nextPage: number): void => {
    handlePageChange(nextPage);
  };

  return (
    <div className={styles.container}>
      <CustomButton
        className={styles.button}
        onClick={() => handleButtonClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </CustomButton>
      <p className={styles.text}>{`Page ${currentPage} of ${pageInfo.pages}`}</p>
      <CustomButton
        className={styles.button}
        onClick={() => handleButtonClick(currentPage + 1)}
        disabled={currentPage === pageInfo.pages}
      >
        Next
      </CustomButton>
    </div>
  );
}
