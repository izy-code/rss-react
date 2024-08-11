import type { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useNavigation, useSearchParams } from '@remix-run/react';
import type { ReactNode } from 'react';

import { fetchCharacterById, type FetchCharacterResult } from '@/api/api';
import { SearchParams } from '@/common/enums';
import { Details } from '@/components/details/Details';
import { Loader } from '@/components/loader/Loader';

export const loader = async ({ request }: LoaderFunctionArgs): Promise<FetchCharacterResult> => {
  const url = new URL(request.url);
  const id = url.searchParams.get(SearchParams.DETAILS) || '';

  const character = await fetchCharacterById(id);

  return character;
};

export default function Index(): ReactNode {
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const character = useLoaderData<typeof loader>();

  const detailsParam = searchParams.get(SearchParams.DETAILS);

  const haveDetailsChanged =
    navigation.location && new URLSearchParams(navigation.location.search).get(SearchParams.DETAILS) !== detailsParam;

  return haveDetailsChanged ? <Loader /> : <Details character={character} />;
}
