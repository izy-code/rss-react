import type { TestFunction } from 'yup';

import { ALLOWED_FILE_TYPES, IMAGE_MAX_SIZE_BYTES } from '@/common/constants';

export const isAllowedFileSize: TestFunction<unknown> = (file: unknown) => {
  if (!(file instanceof File)) {
    return false;
  }

  return file.size <= IMAGE_MAX_SIZE_BYTES;
};

export const isAllowedFileType: TestFunction<unknown> = (file: unknown) => {
  if (!(file instanceof File)) {
    return false;
  }

  return ALLOWED_FILE_TYPES.includes(file.type);
};
