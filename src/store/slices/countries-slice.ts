import { createSlice } from '@reduxjs/toolkit';

import { COUNTRIES } from '@/common/constants';

export const countriesSlice = createSlice({
  initialState: COUNTRIES,
  name: 'countries',
  reducers: {},
});
