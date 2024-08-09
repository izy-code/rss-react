import { type ReactNode, Suspense } from 'react';

import { SearchParams } from '@/common/enums';
import { AsyncWrapper } from '@/components/async-wrapper/AsyncWrapper';
import { ThrowErrorButton } from '@/components/error-button/ThrowErrorButton';
import { Header } from '@/components/header/Header';
import { Loader } from '@/components/loader/Loader';
import { SearchForm } from '@/components/search-form/SearchForm';
import { ThemeButton } from '@/components/theme-button/ThemeButton';

import styles from './page.module.scss';

export default function Home({
  searchParams,
}: {
  searchParams: { [SearchParams.NAME]?: string; [SearchParams.PAGE]?: string; [SearchParams.DETAILS]?: string };
}): ReactNode {
  const suspenseKey = `${searchParams[SearchParams.NAME]}-${searchParams[SearchParams.PAGE]}-${searchParams[SearchParams.DETAILS]}`;

  return (
    <div className={styles.page}>
      <Header>
        <SearchForm />
        <ThrowErrorButton />
        <ThemeButton />
      </Header>
      <Suspense key={suspenseKey} fallback={<Loader />}>
        <AsyncWrapper searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
