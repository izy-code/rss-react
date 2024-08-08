import type { ReadonlyURLSearchParams } from 'next/navigation';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import { DEFAULT_PAGE } from '@/api/api';
import { SearchParams } from '@/common/enums';

export const useQueries = (): {
  queryParams: ReadonlyURLSearchParams;
  name: string;
  page: number;
  details: string;
  router: ReturnType<typeof useRouter>;
  setSearchParam: (key: string, value: string | number) => void;
  removeSearchParam: (key: string) => void;
} => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setSearchParam = useCallback(
    (key: string, value: string | number) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set(key, value.toString());
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const removeSearchParam = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());

      params.delete(key);
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const name = searchParams.get(SearchParams.NAME) || '';
  const page = Number(searchParams.get(SearchParams.PAGE) || DEFAULT_PAGE);
  const details = searchParams.get(SearchParams.DETAILS) || '';

  return {
    queryParams: searchParams,
    name,
    page,
    details,
    router,
    setSearchParam,
    removeSearchParam,
  };
};
