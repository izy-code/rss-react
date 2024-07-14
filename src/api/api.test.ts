import { describe, expect, it, vi } from 'vitest';

import { fetchCharacterById } from './api.ts';
import type { Character } from './types';

const BASE_URL = 'https://rickandmortyapi.com/api/character';

describe('fetchCharacterById', () => {
  const mockFetch = vi.fn();
  global.fetch = mockFetch;

  const mockCharacter: Partial<Character> = { id: 1, name: 'Rick Sanchez' };

  const controller = new AbortController();

  it('fetches character by ID successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => mockCharacter,
    });

    const response = await fetchCharacterById(1, controller);

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/1`, { signal: controller.signal });
    expect(response).toEqual(mockCharacter);
  });

  it('handles 404 error response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const response = await fetchCharacterById(999, controller);

    expect(response).toEqual({ id: null });
  });

  it('handles network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchCharacterById(1, controller)).rejects.toThrow('Network error');
  });

  it('returns null when request is aborted', async () => {
    const abortController = new AbortController();
    abortController.abort();

    mockFetch.mockRejectedValueOnce(new DOMException('The operation was aborted.'));

    const response = await fetchCharacterById(1, abortController);

    expect(response).toBeNull();
  });
});
