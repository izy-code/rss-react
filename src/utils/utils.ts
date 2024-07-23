import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';

export function renderWithUserSetup(node: ReactNode): {
  user: ReturnType<typeof userEvent.setup>;
  container: HTMLElement;
} {
  return {
    user: userEvent.setup(),
    ...render(node),
  };
}
