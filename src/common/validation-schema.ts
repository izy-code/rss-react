import type { InferType } from 'yup';
import { boolean, mixed, number, object, ref, string } from 'yup';

import { isAllowedFileSize, isAllowedFileType } from '@/utils/validation-tests';

import {
  COUNTRIES,
  LOWERCASE_LETTER_REGEX,
  MAX_AGE,
  NUMBER_REGEX,
  SPECIAL_CHARACTER_REGEX,
  UPPERCASE_LETTER_REGEX,
} from './constants';

export const validationSchema = object().shape({
  name: string()
    .required('Name is required')
    .matches(/^\p{Lu}/u, 'Name must start with a capital letter'),
  age: number()
    .transform((parsedValue, originalValue) => (originalValue === '' ? null : parsedValue) as number | null)
    .required('Age is required')
    .min(0, `Age must be non negative`)
    .max(MAX_AGE, `Age must be less than ${MAX_AGE}`)
    .integer(`Age must be an integer`),
  email: string().required('E-mail is required').email('Email must have valid format'),
  password: string()
    .required('Password is required')
    .matches(NUMBER_REGEX, 'Password must contain a number')
    .matches(UPPERCASE_LETTER_REGEX, 'Password must contain an uppercase letter')
    .matches(LOWERCASE_LETTER_REGEX, 'Password must contain a lowercase letter')
    .matches(SPECIAL_CHARACTER_REGEX, 'Password must contain a character from "-+/%*:#@\\$!?|^&"'),
  'password-confirm': string()
    .required('Please confirm your password')
    .oneOf([ref('password')], 'Passwords do not match'),
  gender: string().oneOf(['male', 'female', 'other']).required(),
  tac: boolean()
    .required('You must accept the Terms and Conditions')
    .isTrue('You must accept the Terms and Conditions'),
  picture: mixed((input): input is File => input instanceof File)
    .transform((value) => {
      if (value instanceof File && value.size > 0) {
        return value;
      }
      if (value instanceof FileList && value.item(0) && value.item(0)!.size > 0) {
        return value.item(0);
      }
      return undefined;
    })
    .required('Image is required')
    .defined('Image is required')
    .test('file-size', 'Image size should be less than 2 MB', isAllowedFileSize)
    .test('file-type', 'Allowed image types: PNG, JPG', isAllowedFileType),
  country: string()
    .transform((parsedValue, originalValue) => (originalValue === '' ? null : parsedValue) as string | null)
    .required('Country is required')
    .oneOf(COUNTRIES, 'Should be a country from the list'),
});

export type SchemaInferredType = InferType<typeof validationSchema>;
