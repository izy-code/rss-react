import { type AwaitedReactNode, type ReactNode, Suspense } from 'react';

import { DEFAULT_PAGE, fetchCharacterById, fetchCharacters } from '@/api/api';
import { SearchParams } from '@/common/enums';
import { ThrowErrorButton } from '@/components/error-button/ThrowErrorButton';
import { Header } from '@/components/header/Header';
import { Loader } from '@/components/loader/Loader';
import { SearchForm } from '@/components/search-form/SearchForm';
import { ThemeButton } from '@/components/theme-button/ThemeButton';

import MainSection from '../components/main-section/MainSection';
import styles from './page.module.scss';

interface SearchParamsType {
  [SearchParams.NAME]?: string;
  [SearchParams.PAGE]?: string;
  [SearchParams.DETAILS]?: string;
}

async function Wrapper({ searchParams }: { searchParams: SearchParamsType }): Promise<AwaitedReactNode> {
  const name = searchParams[SearchParams.NAME] || '';
  const page = Number(searchParams[SearchParams.PAGE] || DEFAULT_PAGE);
  const details = searchParams[SearchParams.DETAILS] || '';

  const wait = (ms: number): Promise<void> =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    });

  await wait(700);

  const [cardListData, detailsData] = await Promise.all([fetchCharacters(name, page), fetchCharacterById(details)]);

  return <MainSection cardListData={cardListData} detailsData={detailsData} />;
}

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
        <Wrapper searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
