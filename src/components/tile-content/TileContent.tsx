import type { ReactNode } from 'react';

import type { Form } from '@/store/slices/form-data-slice';

import styles from './TileContent.module.scss';

export function TileContent({ tileData }: { tileData: Form }): ReactNode {
  const { name, age, email, password, gender, tac, picture, country } = tileData;
  const fieldsList = [
    ['Name:', name],
    ['Age:', age],
    ['Email:', email],
    ['Password:', password],
    ['Gender:', gender],
    ['Country:', country],
    ['Accepted T&C:', tac],
  ] as const;

  return (
    <>
      <img className={styles.picture} src={picture} alt={name} />
      <dl className={styles.list}>
        {fieldsList.map(([fieldName, fieldValue]) => (
          <div className={styles.field} key={fieldName}>
            <dt className={styles.term}>{fieldName}</dt>
            <dd className={styles.detail}>{fieldValue.toString()}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
