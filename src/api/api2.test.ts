import { describe, expect, it, vi } from 'vitest';

import { fetchCharacters } from './api';
import type { ApiResponse } from './types';

const BASE_URL = 'https://rickandmortyapi.com/api/character';

describe('fetchCharacters', () => {
  const mockFetch = vi.fn();
  global.fetch = mockFetch;

  const mockApiResponse: ApiResponse = {
    info: { count: 1, pages: 1, next: null, prev: null },
    results: [
      {
        id: 1,
        name: 'Rick Sanchez',
        image: '',
        species: '',
        status: '',
        gender: '',
        url: '',
        created: '',
        episode: [],
        origin: { name: '', url: '' },
        location: { name: '', url: '' },
        type: '',
      },
    ],
  };

  const controller = new AbortController();

  it('fetches characters successfully with search term', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => mockApiResponse,
    });

    const response = await fetchCharacters('Rick', controller);

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/?page=1&name=Rick`, { signal: controller.signal });
    expect(response).toEqual(mockApiResponse);
  });

  it('fetches characters successfully without search term', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => mockApiResponse,
    });

    const response = await fetchCharacters('', controller);

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/?page=1`, { signal: controller.signal });
    expect(response).toEqual(mockApiResponse);
  });

  it('handles 404 error response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const response = await fetchCharacters('Unknown', controller);

    expect(response).toEqual({ results: [] });
  });

  it('handles 500 error response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const response = await fetchCharacters('Error', controller);

    expect(response).toEqual({ results: [] });
  });

  it('handles network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchCharacters('Error', controller)).rejects.toThrow('Network error');
  });

  it('returns null when request is aborted', async () => {
    const abortController = new AbortController();
    abortController.abort();

    mockFetch.mockRejectedValueOnce(new DOMException('The operation was aborted.'));

    const response = await fetchCharacters('Rick', abortController);

    expect(response).toBeNull();
  });
});
