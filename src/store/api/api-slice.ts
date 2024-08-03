import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';

import { SearchParams } from '@/common/enums';

import type { CharacterData, CharacterListData } from './types';

export const BASE_URL = 'https://rickandmortyapi.com/api/';
export const DEFAULT_PAGE = 1;

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

  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
});

export const { useGetCharactersListQuery, useGetCharacterByIdQuery } = apiSlice;
