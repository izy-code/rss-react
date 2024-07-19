import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { routes } from './routes';

describe('Router render', () => {
  const user = userEvent.setup();

  it('should match the snapshot for main routes', async () => {
    const memoryRouter = createMemoryRouter(routes, { initialEntries: ['/'] });
    const { container } = render(<RouterProvider router={memoryRouter} />);

    await screen.findByRole('heading', { name: /rick/i });

    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot for 404 page', () => {
    const memoryRouter = createMemoryRouter(routes, { initialEntries: ['/non-existent-route'] });
    const { container } = render(<RouterProvider router={memoryRouter} />);

    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot for error page', async () => {
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

    const memoryRouter = createMemoryRouter(routes, { initialEntries: ['/'] });
    const { container } = render(<RouterProvider router={memoryRouter} />);

    const errorButton = screen.getByRole('button', { name: 'Throw error' });

    await user.click(errorButton);

    expect(consoleErrorMock).toHaveBeenCalled();
    expect(container).toMatchSnapshot();
  });
});
