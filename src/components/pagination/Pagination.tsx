import { type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { CharacterListInfo } from '@/api/types';
import { SearchParams } from '@/common/enums';

import { CustomButton } from '../custom-button/CustomButton';
import styles from './Pagination.module.scss';

interface Props {
  pageInfo: CharacterListInfo;
}

export function Pagination({ pageInfo }: Props): ReactNode {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get(SearchParams.PAGE));

  const handlePageChange = (pageNumber: number): void => {
    searchParams.set(SearchParams.PAGE, pageNumber.toString());
    setSearchParams(searchParams);
  };

  const handleButtonClick = (evt: React.MouseEvent, nextPage: number): void => {
    evt.stopPropagation();

    handlePageChange(nextPage);
  };

  return (
    <div className={styles.container}>
      <CustomButton
        className={styles.button}
        onClick={(evt) => handleButtonClick(evt, currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </CustomButton>
      <p className={styles.text}>{`Page ${currentPage} of ${pageInfo.pages}`}</p>
      <CustomButton
        className={styles.button}
        onClick={(evt) => handleButtonClick(evt, currentPage + 1)}
        disabled={currentPage === pageInfo.pages}
      >
        Next
      </CustomButton>
    </div>
  );
}
