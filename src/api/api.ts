import { SearchParams } from '@/common/enums';
import { isCharacterData, isCharacterListData } from '@/utils/type-guards';

import type { CharacterData, CharacterListData } from './types';

export const BASE_URL = 'https://rickandmortyapi.com/api/character';
export const DEFAULT_PAGE = 1;

type FetchStatusType = 'aborted' | 'success' | 'empty';
export type FetchCharacterListResult = { status: FetchStatusType; data?: CharacterListData };
export type FetchCharacterResult = { status: FetchStatusType; data?: CharacterData };

const emptyResult = { status: 'empty' } as const;
const abortedResult = { status: 'aborted' } as const;

export const fetchCharacters = async (
  searchTerm: string,
  controller: AbortController,
  page = DEFAULT_PAGE,
): Promise<FetchCharacterListResult> => {
  const searchParams = new URLSearchParams({
    [SearchParams.PAGE]: page.toString(),
    [SearchParams.NAME]: searchTerm,
  });

  const url = `${BASE_URL}/?${searchParams.toString()}`;

  try {
    const response = await fetch(url, { signal: controller?.signal });

    if (!response.ok) {
      if (response.status === 404) {
        return emptyResult;
      }

      throw new Error(`Fetching response status is not ok: ${response.status}`);
    }

    const parsedResponse: unknown = await response.json();

    if (isCharacterListData(parsedResponse)) {
      return { status: 'success', data: parsedResponse };
    }

    return emptyResult;
  } catch (error) {
    if (controller?.signal.aborted) {
      return abortedResult;
    }

    throw error;
  }
};

export const fetchCharacterById = async (id: string, controller: AbortController): Promise<FetchCharacterResult> => {
  const url = `${BASE_URL}/${id}`;

  try {
    const response = await fetch(url, { signal: controller?.signal });

    if (!response.ok) {
      if (response.status === 404) {
        return emptyResult;
      }

      throw new Error(`Fetching response status is not ok: ${response.status}`);
    }

    const parsedResponse: unknown = await response.json();

    if (isCharacterData(parsedResponse)) {
      return { status: 'success', data: parsedResponse };
    }

    return emptyResult;
  } catch (error) {
    if (controller?.signal.aborted) {
      return abortedResult;
    }

    throw error;
  }
};
