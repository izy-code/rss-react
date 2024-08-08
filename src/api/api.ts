import { SearchParams } from '@/common/enums';
import { isCharacterData, isCharacterListData } from '@/utils/type-guards';

import type { CharacterData, CharacterListData } from './types';

export const BASE_URL = 'https://rickandmortyapi.com/api/character';
export const DEFAULT_PAGE = 1;

export type FetchStatusType = 'success' | 'empty' | 'error';
export type FetchCharacterListResult = { status: FetchStatusType; data?: CharacterListData };
export type FetchCharacterResult = { status: FetchStatusType; data?: CharacterData };

const emptyResult = { status: 'empty' } as const;
const errorResult = { status: 'error' } as const;

export const fetchCharacters = async (searchTerm: string, page = DEFAULT_PAGE): Promise<FetchCharacterListResult> => {
  const searchParams = new URLSearchParams({
    [SearchParams.PAGE]: page.toString(),
    [SearchParams.NAME]: searchTerm,
  });

  const url = `${BASE_URL}/?${searchParams.toString()}`;

  try {
    const response = await fetch(url);

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
    return errorResult;
  }
};

export const fetchCharacterById = async (id: string): Promise<FetchCharacterResult> => {
  const url = `${BASE_URL}/${id}`;

  try {
    const response = await fetch(url);

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
    return errorResult;
  }
};
