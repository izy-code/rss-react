import { type AwaitedReactNode } from 'react';

import type { FetchStatusType } from '@/api/api';
import { DEFAULT_PAGE, fetchCharacterById, fetchCharacters } from '@/api/api';
import { SearchParams } from '@/common/enums';
import MainSection from '@/components/main-section/MainSection';

interface SearchParamsType {
  [SearchParams.NAME]?: string;
  [SearchParams.PAGE]?: string;
  [SearchParams.DETAILS]?: string;
}

export async function AsyncWrapper({ searchParams }: { searchParams: SearchParamsType }): Promise<AwaitedReactNode> {
  const name = searchParams[SearchParams.NAME] || '';
  const page = Number(searchParams[SearchParams.PAGE] || DEFAULT_PAGE);
  const details = searchParams[SearchParams.DETAILS] || '';

  const wait = (ms: number): Promise<void> =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    });

  await wait(500);

  const cardListPromise = await fetchCharacters(name, page);
  const detailsPromise = details
    ? fetchCharacterById(details)
    : Promise.resolve({ status: 'empty' as FetchStatusType });

  const [cardListData, detailsData] = await Promise.all([cardListPromise, detailsPromise]);

  return <MainSection cardListData={cardListData} detailsData={detailsData} />;
}
