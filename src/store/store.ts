import { configureStore } from '@reduxjs/toolkit';

import { apiSlice } from './api/api-slice';
import { favoriteItemsSlice } from './favorite-items/favorite-items-slice';

export const store = configureStore({
  reducer: {
    favoriteItems: favoriteItemsSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
