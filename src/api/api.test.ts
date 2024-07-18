import { describe, expect, it, vi } from 'vitest';

import { apiResponseMock, characterMock } from '@/test/mocks/mocks.ts';

import { BASE_URL, fetchCharacterById, fetchCharacters } from './api.ts';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('fetchCharacterById', () => {
  const controller = new AbortController();

  it('fetches character by ID successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => characterMock,
    });

    const response = await fetchCharacterById('1', controller);

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/1`, { signal: controller.signal });
    expect(response).toEqual({ status: 'success', data: characterMock });
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
  const controller = new AbortController();

  it('fetches characters successfully with search term', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => apiResponseMock,
    });

    const initialSearchTerm = 'Rick';

    const response = await fetchCharacters(initialSearchTerm, controller);

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/?page=1&name=${initialSearchTerm}`, {
      signal: controller.signal,
    });
    expect(response).toEqual({
      status: 'success',
      data: apiResponseMock,
    });
  });

  it('fetches characters successfully without search term', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => apiResponseMock,
    });

    const response = await fetchCharacters('', controller);

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/?page=1&name=`, { signal: controller.signal });
    expect(response).toEqual({
      status: 'success',
      data: apiResponseMock,
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

    const response = await fetchCharacters('Any search', abortController);

    expect(response).toEqual({ status: 'aborted' });
  });
});
