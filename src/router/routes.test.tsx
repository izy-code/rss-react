import { createMemoryRouter, RouterProvider } from '@remix-run/react';
import { render, screen } from '@testing-library/react';

import { MOCK_PAGE_NUMBER, MOCK_SEARCH_NAME } from '@/test/msw/handlers';
import { renderWithProvidersAndUser } from '@/utils/test-utils';

import { routes } from './routes';

describe('Router render', () => {
  it('should match the snapshot for main routes', async () => {
    const memoryRouter = createMemoryRouter(routes, {
      initialEntries: [`/?page=${MOCK_PAGE_NUMBER}&name=${MOCK_SEARCH_NAME}`],
    });
    const { container } = renderWithProvidersAndUser(<RouterProvider router={memoryRouter} />);

    await screen.findByRole('button', { name: /prev/i });

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
    const { user, container } = renderWithProvidersAndUser(<RouterProvider router={memoryRouter} />);

    const errorButton = screen.getByRole('button', { name: /throw error/i });

    await user.click(errorButton);

    expect(consoleErrorMock).toHaveBeenCalled();
    expect(container).toMatchSnapshot();
  });
});
