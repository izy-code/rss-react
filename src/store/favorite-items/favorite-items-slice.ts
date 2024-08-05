import { createAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import type { RootState } from '../store';

const favoriteItemsAdapter = createEntityAdapter();

const initialState = favoriteItemsAdapter.getInitialState();

const hydrate = createAction<RootState>(HYDRATE);

export const favoriteItemsSlice = createSlice({
  name: 'favoriteItems',
  initialState,
  reducers: {
    selectItem: (state, action) => {
      favoriteItemsAdapter.addOne(state, action);
    },
    unselectItem: (state, action) => {
      favoriteItemsAdapter.removeOne(state, action);
    },
    unselectAll: (state) => {
      favoriteItemsAdapter.removeAll(state);
    },
  },

  extraReducers: (builder) => {
    builder.addCase(hydrate, (state, action) => {
      favoriteItemsAdapter.upsertMany(state, action.payload.favoriteItems.entities);
    });
  },
});

export const { selectItem, unselectItem, unselectAll } = favoriteItemsSlice.actions;

export const { selectAll: selectAllFavoriteItems, selectById: selectFavoriteItemById } =
  favoriteItemsAdapter.getSelectors((state: RootState) => state.favoriteItems);
