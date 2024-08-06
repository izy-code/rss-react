import { screen } from '@testing-library/react';

import { SearchParams } from '@/common/enums';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';
import Home from '@/pages';
import Page404 from '@/pages/404';
import Page500 from '@/pages/500';
import { MOCK_PAGE_NUMBER, MOCK_SEARCH_NAME } from '@/test/msw/handlers';
import { getMockedNextRouter, renderWithProvidersAndUser } from '@/utils/test-utils';

describe('Pages render', () => {
  it('should match the snapshot for main routes', async () => {
    const { NextProvider } = getMockedNextRouter({
      query: { [SearchParams.PAGE]: MOCK_PAGE_NUMBER, [SearchParams.NAME]: MOCK_SEARCH_NAME },
    });

    const { container } = renderWithProvidersAndUser(
      <NextProvider>
        <Home />
      </NextProvider>,
    );

    await screen.findByRole('button', { name: /prev/i });

    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot for 404 and 500 pages', () => {
    const { NextProvider } = getMockedNextRouter();
    const { container } = renderWithProvidersAndUser(
      <NextProvider>
        <Page404 />
        <Page500 />
      </NextProvider>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot for error page', async () => {
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { NextProvider } = getMockedNextRouter();

    const { container, user } = renderWithProvidersAndUser(
      <NextProvider>
        <ErrorBoundary>
          <Home />
        </ErrorBoundary>
      </NextProvider>,
    );

    const errorButton = screen.getByRole('button', { name: /throw error/i });

    await user.click(errorButton);

    expect(consoleErrorMock).toHaveBeenCalled();
    expect(container).toMatchSnapshot();
  });
});
