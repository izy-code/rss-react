import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';

export type DataObject = Record<string, string | Record<string, string>>;

export function renderWithUserSetup(node: ReactNode): {
  user: ReturnType<typeof userEvent.setup>;
  container: HTMLElement;
} {
  return {
    user: userEvent.setup(),
    ...render(node),
  };
}

export const getCsvObjectUrl = (data: DataObject[]): string => {
  if (data.length === 0 || !data[0]) {
    return '';
  }

  const flattenObject = (
    obj: DataObject,
    parentKey = '',
    result: Record<string, string> = {},
  ): Record<string, string> => {
    Object.entries(obj).forEach(([key, value]) => {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof value === 'object' && value !== null) {
        flattenObject(value, newKey, result);
      } else {
        result[newKey] = String(value);
      }
    });

    return result;
  };

  const titlesArray = Object.keys(flattenObject(data[0]));
  const rowsArray = [titlesArray];

  data.forEach((item) => {
    const flattenedItem = flattenObject(item);
    rowsArray.push(Object.values(flattenedItem));
  });

  let csvString = '';

  rowsArray.forEach((row) => {
    csvString += `${row.join(';')}\n`;
  });

  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });

  return URL.createObjectURL(blob);
};
