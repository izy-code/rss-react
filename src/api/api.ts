import type { ApiResponse } from './types';

const BASE_URL = 'https://rickandmortyapi.com/api/character';
const DEFAULT_PAGE = 1;

export const fetchCharacters = async (
  searchTerm: string,
  controller: AbortController,
  page = DEFAULT_PAGE,
): Promise<ApiResponse | null> => {
  const params = new URLSearchParams({
    page: page.toString(),
  });

  if (searchTerm) {
    params.append('name', searchTerm);
  }

  const url = `${BASE_URL}/?${params.toString()}`;

  const response = await fetch(url, { signal: controller?.signal });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }

    throw new Error('Network response was not ok');
  }

  return response.json() as Promise<ApiResponse | null>;
};
