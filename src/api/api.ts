import type { ApiResponse, Character } from './types';

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
      if (response.status === 404 || response.status === 500) {
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

export const fetchCharacterById = async (
  id: number,
  controller: AbortController,
): Promise<Partial<Character> | null> => {
  const url = `${BASE_URL}/${id}`;

  try {
    const response = await fetch(url, { signal: controller?.signal });

    if (!response.ok) {
      if (response.status === 404) {
        return { id: null };
      }
      throw new Error('Network response was not ok');
    }

    return (await response.json()) as Partial<Character>;
  } catch (error) {
    if (controller?.signal.aborted) {
      return null;
    }

    throw error;
  }
};
