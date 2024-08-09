import { screen } from '@testing-library/react';
import { vi } from 'vitest';

import { AsyncWrapper } from '@/app/page';
import { SearchParams } from '@/common/enums';
import { charactersDataMock } from '@/test/mocks/mocks';
import { MOCK_PAGE_NUMBER, MOCK_SEARCH_NAME } from '@/test/msw/handlers';
import { renderWithProvidersAndUser } from '@/utils/test-utils';

import { Pagination } from './Pagination';

const mockedRouterPush = vi.fn();
let mockedPageNumber = +MOCK_PAGE_NUMBER;

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation');
  return {
    ...actual,
    useRouter: (): {
      push: () => void;
    } => ({ push: mockedRouterPush }),
    useSearchParams: vi.fn(() => {
      const searchParams = new URLSearchParams({ [SearchParams.PAGE]: mockedPageNumber.toString() });
      return searchParams;
    }),
  };
});

describe('Pagination Component', () => {
  const pageInfoMock = charactersDataMock.info;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('disables the "Prev" and "Next" button on the single page', async () => {
    const Awaited = (await AsyncWrapper({
      searchParams: {
        [SearchParams.NAME]: MOCK_SEARCH_NAME,
        [SearchParams.PAGE]: MOCK_PAGE_NUMBER,
      },
    })) as JSX.Element;

    renderWithProvidersAndUser(Awaited);

    const nextButton = screen.getByRole('button', { name: /next/i });
    const prevButton = screen.getByRole('button', { name: /prev/i });

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  it('updates URL query parameter when "Next" button is clicked', async () => {
    mockedPageNumber = 2;

    const { user } = renderWithProvidersAndUser(<Pagination pageInfo={pageInfoMock} />);

    const nextButton = screen.getByRole('button', { name: /next/i });

    await user.click(nextButton);

    expect(mockedRouterPush).toHaveBeenCalledWith(`?page=${mockedPageNumber + 1}`);
  });

  it('updates URL query parameter when "Prev" button is clicked', async () => {
    mockedPageNumber = 2;

    const { user } = renderWithProvidersAndUser(<Pagination pageInfo={pageInfoMock} />);

    const prevButton = screen.getByRole('button', { name: /prev/i });

    await user.click(prevButton);

    expect(mockedRouterPush).toHaveBeenCalledWith(`?page=${mockedPageNumber - 1}`);
  });
});
