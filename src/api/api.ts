import type { ApiResponse } from './types';

const BASE_URL = 'https://rickandmortyapi.com/api/character';
export const DEFAULT_PAGE = 1;

export const fetchCharacters = async (
  searchTerm: string,
  controller: AbortController,
  page = DEFAULT_PAGE,
): Promise<ApiResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
  });

  if (searchTerm) {
    params.append('name', searchTerm);
  }

  const url = `${BASE_URL}/?${params.toString()}`;

  try {
    const response = await fetch(url, { signal: controller?.signal });

    if (!response.ok) {
      if (response.status === 404) {
        return { results: [] };
      }
      throw new Error('Network response was not ok');
    }

    return (await response.json()) as ApiResponse;
  } catch (error) {
    if (controller?.signal.aborted) {
      return null;
    }

    throw error;
  }
};
