import { screen } from '@testing-library/react';
import React from 'react';

import RootLayout from '@/app/layout';
import Page404 from '@/app/not-found';
import Home, { AsyncWrapper } from '@/app/page';
import { SearchParams } from '@/common/enums';
import { ThrowErrorButton } from '@/components/error-button/ThrowErrorButton';
import { MOCK_PAGE_NUMBER, MOCK_SEARCH_NAME } from '@/test/msw/handlers';
import { renderWithProvidersAndUser } from '@/utils/test-utils';

describe('Pages render', () => {
  vi.mock('next/navigation', async () => {
    const actual = await vi.importActual('next/navigation');
    return {
      ...actual,
      useRouter: vi.fn(() => ({
        push: vi.fn(),
      })),
      useSearchParams: vi.fn(() => {
        const searchParams = new URLSearchParams({});
        return searchParams;
      }),
    };
  });

  it('should match the snapshot for main page', async () => {
    const Awaited = await AsyncWrapper({
      searchParams: {
        [SearchParams.NAME]: MOCK_SEARCH_NAME,
        [SearchParams.PAGE]: MOCK_PAGE_NUMBER,
      },
    });

    const { container } = renderWithProvidersAndUser(
      <Home
        searchParams={{
          [SearchParams.NAME]: MOCK_SEARCH_NAME,
          [SearchParams.PAGE]: MOCK_PAGE_NUMBER,
        }}
        TestPlaceholder={() => Awaited}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot for 404 page', () => {
    const { container } = renderWithProvidersAndUser(<Page404 />);

    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot for error page', async () => {
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { container, user } = renderWithProvidersAndUser(
      <RootLayout>
        <ThrowErrorButton />
      </RootLayout>,
    );

    const errorButton = screen.getByRole('button', { name: /throw error/i });

    await user.click(errorButton);

    expect(consoleErrorMock).toHaveBeenCalled();
    expect(container).toMatchSnapshot();
  });
});
