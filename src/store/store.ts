import { configureStore } from '@reduxjs/toolkit';

import { countriesSlice } from './slices/countries-slice';
import { formDataSlice } from './slices/form-data-slice';

export const store = configureStore({
  reducer: {
    formData: formDataSlice.reducer,
    countries: countriesSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
