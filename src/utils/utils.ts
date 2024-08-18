import {
  LOWERCASE_LETTER_REGEX,
  NUMBER_REGEX,
  SPECIAL_CHARACTER_REGEX,
  UPPERCASE_LETTER_REGEX,
} from '@/common/constants';

export const fileToBase64 = async (file: File): Promise<string> => {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    if (!(file instanceof File)) {
      reject(new Error('Parameter is not an instance of File'));
    }

    fileReader.onload = (): void => resolve(fileReader.result as string);
    fileReader.onerror = (error): void => reject(error);

    fileReader.readAsDataURL(file);
  });
};

const regexArray = [NUMBER_REGEX, UPPERCASE_LETTER_REGEX, LOWERCASE_LETTER_REGEX, SPECIAL_CHARACTER_REGEX] as RegExp[];
export const getPasswordStrength = (password: string): number => {
  const strength = regexArray.reduce((result, regex) => result + Number(regex.test(password)), 0);

  return strength;
};
export const MAX_STRENGTH = regexArray.length;
