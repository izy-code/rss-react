import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { SchemaInferredType } from '@/common/validationSchema';

export type Form = Omit<SchemaInferredType, 'picture'> & { picture: string };

const initialState: Form[] = [];

export const formDataSlice = createSlice({
  initialState,
  name: 'formData',
  reducers: {
    saveFormData: (state, action: PayloadAction<Form>) => {
      state.unshift(action.payload);
    },
  },
});

export const { saveFormData } = formDataSlice.actions;
