import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../store';

const favoriteItemsAdapter = createEntityAdapter();

const initialState = favoriteItemsAdapter.getInitialState();

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
  },
});

export const { selectItem, unselectItem } = favoriteItemsSlice.actions;

export const { selectAll: selectAllFavoriteItems, selectById: selectFavoriteItemById } =
  favoriteItemsAdapter.getSelectors((state: RootState) => state.favoriteItems);
