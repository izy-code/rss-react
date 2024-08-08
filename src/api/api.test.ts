import { characterMock, charactersDataMock } from '@/test/mocks/mocks.ts';
import { MOCK_SEARCH_NAME, MOCK_STATUS_500 } from '@/test/msw/handlers.ts';

import { fetchCharacterById, fetchCharacters } from './api.ts';

describe('fetchCharacterById', () => {
  const controller = new AbortController();

  it('fetches character by ID successfully', async () => {
    const response = await fetchCharacterById(characterMock.id.toString(), controller);

    expect(response).toEqual({ status: 'success', data: characterMock });
  });

  it('handles 404 status response', async () => {
    const response = await fetchCharacterById('wrong-ID', controller);

    expect(response).toEqual({ status: 'empty' });
  });

  it('handles 500 status response', async () => {
    await expect(fetchCharacterById(MOCK_STATUS_500, controller)).rejects.toThrow(
      /fetching response status is not ok/i,
    );
  });

  it('handles network error', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');

    fetchSpy.mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchCharacterById(characterMock.id.toString(), controller)).rejects.toThrow('Network error');
  });

  it('handles request abort', async () => {
    controller.abort();

    const response = await fetchCharacterById('Any search', controller);

    expect(response).toEqual({ status: 'aborted' });
  });
});

describe('fetchCharacters', () => {
  const controller = new AbortController();

  it('fetches characters successfully with search term', async () => {
    const initialSearchTerm = MOCK_SEARCH_NAME;

    const response = await fetchCharacters(initialSearchTerm, controller);

    expect(response).toEqual({
      status: 'success',
      data: charactersDataMock,
    });
  });

  it('handles 404 status response', async () => {
    const response = await fetchCharacters('Unknown', controller);

    expect(response).toEqual({ status: 'empty' });
  });

  it('handles 500 status response', async () => {
    await expect(fetchCharacters(MOCK_STATUS_500, controller)).rejects.toThrow(/fetching response status is not ok/i);
  });

  it('handles network error', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');

    fetchSpy.mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchCharacters(characterMock.id.toString(), controller)).rejects.toThrow('Network error');
  });

  it('handles request abort', async () => {
    controller.abort();

    const response = await fetchCharacters('Any search', controller);

    expect(response).toEqual({ status: 'aborted' });
  });
});
