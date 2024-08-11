import type { CharacterData, CharacterListData, CharacterListInfo } from '@/api/types';

export function isCharacterData(data: unknown): data is CharacterData {
  return Boolean(
    typeof data === 'object' &&
      data &&
      'id' in data &&
      typeof data.id === 'number' &&
      'name' in data &&
      typeof data.name === 'string' &&
      'image' in data &&
      typeof data.image === 'string' &&
      'species' in data &&
      typeof data.species === 'string' &&
      'status' in data &&
      typeof data.status === 'string' &&
      'gender' in data &&
      typeof data.gender === 'string' &&
      'url' in data &&
      typeof data.url === 'string' &&
      'created' in data &&
      typeof data.created === 'string' &&
      'episode' in data &&
      Array.isArray(data.episode) &&
      data.episode.every((item: unknown) => typeof item === 'string') &&
      'origin' in data &&
      typeof data.origin === 'object' &&
      data.origin &&
      'name' in data.origin &&
      typeof data.origin.name === 'string' &&
      'url' in data.origin &&
      typeof data.origin.url === 'string' &&
      'location' in data &&
      typeof data.location === 'object' &&
      data.location &&
      'name' in data.location &&
      typeof data.location.name === 'string' &&
      'url' in data.location &&
      typeof data.location.url === 'string' &&
      'type' in data &&
      typeof data.type === 'string',
  );
}

function isCharacterListInfoData(data: unknown): data is CharacterListInfo {
  return Boolean(
    typeof data === 'object' &&
      data &&
      'count' in data &&
      typeof data.count === 'number' &&
      'pages' in data &&
      typeof data.pages === 'number' &&
      'next' in data &&
      (typeof data.next === 'string' || data.next === null) &&
      'prev' in data &&
      (typeof data.prev === 'string' || data.prev === null),
  );
}

export function isCharacterListData(data: unknown): data is CharacterListData {
  return Boolean(
    typeof data === 'object' &&
      data &&
      'info' in data &&
      isCharacterListInfoData(data.info) &&
      'results' in data &&
      Array.isArray(data.results) &&
      data.results.every((item: unknown) => isCharacterData(item)),
  );
}
