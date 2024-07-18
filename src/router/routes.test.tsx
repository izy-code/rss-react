import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { routes } from './routes';

describe('Routes rendering testing', () => {
  it('should match the snapshot for main routes', async () => {
    const memoryRouter = createMemoryRouter(routes, { initialEntries: ['/'] });
    const { container } = render(<RouterProvider router={memoryRouter} />);
    expect(await screen.findByText(/Rick/)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot for 404 page', () => {
    const memoryRouter = createMemoryRouter(routes, { initialEntries: ['/non-existent-route'] });
    const { container } = render(<RouterProvider router={memoryRouter} />);

    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot for error page', () => {
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

    const memoryRouter = createMemoryRouter(routes, { initialEntries: ['/'] });
    const { container } = render(<RouterProvider router={memoryRouter} />);

    const errorButton = screen.getByText('Throw error');

    fireEvent.click(errorButton);

    expect(consoleErrorMock).toHaveBeenCalled();
    expect(container).toMatchSnapshot();
  });
});
