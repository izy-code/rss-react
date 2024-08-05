import type { CombinedState, EndpointDefinitions } from '@reduxjs/toolkit/query/react';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Action, PayloadAction } from '@reduxjs/toolkit/react';
import { HYDRATE } from 'next-redux-wrapper';

import { SearchParams } from '@/common/enums';

import type { RootState } from '../store';
import type { CharacterData, CharacterListData } from './types';

export const BASE_URL = 'https://rickandmortyapi.com/api/';
export const DEFAULT_PAGE = 1;

function isHydrateAction(action: Action): action is PayloadAction<RootState> {
  return action.type === HYDRATE;
}

interface CharactersQueryParamsType {
  searchTerm: string;
  page?: number;
}

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),

  endpoints: (builder) => ({
    getCharactersList: builder.query<CharacterListData, CharactersQueryParamsType>({
      query: ({ searchTerm, page = DEFAULT_PAGE }) => {
        const searchParams = new URLSearchParams({
          [SearchParams.PAGE]: page.toString(),
          [SearchParams.NAME]: searchTerm,
        });

        return `character/?${searchParams.toString()}`;
      },
    }),
    getCharacterById: builder.query<CharacterData, string>({
      query: (id) => `character/${id}`,
    }),
  }),

  extractRehydrationInfo(action, { reducerPath }): CombinedState<EndpointDefinitions, string, 'api'> | undefined {
    if (isHydrateAction(action)) {
      return action.payload[reducerPath];
    }

    return undefined;
  },
});

export const {
  useGetCharactersListQuery,
  useGetCharacterByIdQuery,
  util: { getRunningQueriesThunk },
} = apiSlice;

export const { getCharactersList, getCharacterById } = apiSlice.endpoints;
