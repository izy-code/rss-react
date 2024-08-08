import { characterMock, charactersDataMock } from '@/test/mocks/mocks.ts';
import { MOCK_SEARCH_NAME, MOCK_STATUS_500 } from '@/test/msw/handlers.ts';

import { fetchCharacterById, fetchCharacters } from './api.ts';

describe('fetchCharacterById', () => {
  it('fetches character by ID successfully', async () => {
    const response = await fetchCharacterById(characterMock.id.toString());

    expect(response).toEqual({ status: 'success', data: characterMock });
  });

  it('handles 404 status response', async () => {
    const response = await fetchCharacterById('wrong-ID');

    expect(response).toEqual({ status: 'empty' });
  });

  it('handles 500 status response', async () => {
    const response = await fetchCharacterById(MOCK_STATUS_500);

    expect(response).toEqual({ status: 'error' });
  });

  it('handles network error', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');

    fetchSpy.mockRejectedValueOnce(new Error('Network error'));

    const response = await fetchCharacterById(characterMock.id.toString());

    expect(response).toEqual({ status: 'error' });
  });
});

describe('fetchCharacters', () => {
  it('fetches characters successfully with search term', async () => {
    const response = await fetchCharacters(MOCK_SEARCH_NAME);

    expect(response).toEqual({
      status: 'success',
      data: charactersDataMock,
    });
  });

  it('handles 404 status response', async () => {
    const response = await fetchCharacters('Unknown');

    expect(response).toEqual({ status: 'empty' });
  });

  it('handles 500 status response', async () => {
    const response = await fetchCharacters(MOCK_STATUS_500);

    expect(response).toEqual({ status: 'error' });
  });

  it('handles network error', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');

    fetchSpy.mockRejectedValueOnce(new Error('Network error'));

    const response = await fetchCharacters(characterMock.id.toString());

    expect(response).toEqual({ status: 'error' });
  });
});
