import { describe, expect, it, vi } from 'vitest';

import { BASE_URL, fetchCharacterById, fetchCharacters } from './api.ts';
import type { CharacterData, CharacterListData } from './types';

const mockCharacter: CharacterData = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  episode: ['1', '2', '3'],
  origin: {
    name: '',
    url: '',
  },
  image: '',
  created: '',
  url: '',
  location: {
    name: '',
    url: '',
  },
  type: '',
};

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('fetchCharacterById', () => {
  const controller = new AbortController();

  it('fetches character by ID successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => mockCharacter,
    });

    const response = await fetchCharacterById('1', controller);

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/1`, { signal: controller.signal });
    expect(response).toEqual({ status: 'success', data: mockCharacter });
  });

  it('handles 404 error response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const response = await fetchCharacterById('wrong-ID', controller);

    expect(response).toEqual({ status: 'empty' });
  });

  it('handles network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchCharacterById('1', controller)).rejects.toThrow('Network error');
  });

  it('handles request abort', async () => {
    const abortController = new AbortController();
    abortController.abort();

    mockFetch.mockRejectedValueOnce(new DOMException('The operation was aborted.'));

    const response = await fetchCharacterById('1', abortController);

    expect(response).toEqual({ status: 'aborted' });
  });
});

describe('fetchCharacters', () => {
  const mockCharacterList: CharacterListData = {
    info: { count: 1, pages: 1, next: null, prev: null },
    results: [mockCharacter],
  };

  const controller = new AbortController();

  it('fetches characters successfully with search term', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => mockCharacterList,
    });

    const response = await fetchCharacters('Rick', controller);

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/?page=1&name=Rick`, { signal: controller.signal });
    expect(response).toEqual({
      status: 'success',
      data: mockCharacterList,
    });
  });

  it('fetches characters successfully without search term', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => mockCharacterList,
    });

    const response = await fetchCharacters('', controller);

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/?page=1&name=`, { signal: controller.signal });
    expect(response).toEqual({
      status: 'success',
      data: mockCharacterList,
    });
  });

  it('handles 404 error response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const response = await fetchCharacters('Unknown', controller);

    expect(response).toEqual({ status: 'empty' });
  });

  it('handles network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchCharacters('Error', controller)).rejects.toThrow('Network error');
  });

  it('handles request abort', async () => {
    const abortController = new AbortController();
    abortController.abort();

    mockFetch.mockRejectedValueOnce(new DOMException('The operation was aborted.'));

    const response = await fetchCharacters('Rick', abortController);

    expect(response).toEqual({ status: 'aborted' });
  });
});
