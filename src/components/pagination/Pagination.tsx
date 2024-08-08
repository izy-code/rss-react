import { type ReactNode, useEffect } from 'react';

import { DEFAULT_PAGE } from '@//api/api';
import type { CharacterListInfo } from '@/api/types';
import { SearchParams } from '@/common/enums';
import { useQueries } from '@/hooks/useQueries';

import { CustomButton } from '../custom-button/CustomButton';
import styles from './Pagination.module.scss';

interface Props {
  pageInfo: CharacterListInfo;
}

export function Pagination({ pageInfo }: Props): ReactNode {
  const { page, setSearchParam } = useQueries();

  const currentPage = Number(page?.toString() || DEFAULT_PAGE);

  const handlePageChange = (pageNumber: number): void => {
    setSearchParam(SearchParams.PAGE, pageNumber.toString());
  };

  const handleButtonClick = (nextPage: number): void => {
    handlePageChange(nextPage);
  };

  useEffect(() => {
    if (!Number.isInteger(page) || page < DEFAULT_PAGE) {
      setSearchParam(SearchParams.PAGE, DEFAULT_PAGE.toString());
    }
  }, [page, setSearchParam]);

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
