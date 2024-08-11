import { screen, waitFor } from '@testing-library/react';
import mockRouter from 'next-router-mock';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';

import { BASE_URL } from '@/api/api';
import { SearchParams } from '@/common/enums';
import { characterMock } from '@/test/mocks/mocks';
import { MOCK_PAGE_NUMBER, MOCK_SEARCH_NAME } from '@/test/msw/handlers';
import { renderWithProvidersAndUser } from '@/utils/test-utils';

import { AsyncWrapper } from '../async-wrapper/AsyncWrapper';
import { Card } from './Card';

describe('Card Component', () => {
  afterEach((): void => {
    vi.clearAllMocks();
  });

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

  it('renders the relevant card data', (): void => {
    renderWithProvidersAndUser(<Card character={characterMock} />);

    expect(screen.getByRole('heading', { name: characterMock.name })).toBeInTheDocument();
    expect(screen.getByAltText(characterMock.name)).toBeInTheDocument();
  });

  it('validates that clicking on a card opens a detailed card component by checking URL change', async (): Promise<void> => {
    vi.mock('next/router', () => vi.importActual('next-router-mock'));

    const { user } = renderWithProvidersAndUser(
      <MemoryRouterProvider>
        <Card character={characterMock} />
      </MemoryRouterProvider>,
    );

    const linkElement = screen.getByRole('link');

    expect(linkElement).toHaveAttribute('href', `/?${SearchParams.DETAILS}=${characterMock.id}`);

    await user.click(linkElement);

    expect(mockRouter).toMatchObject({
      query: { [SearchParams.DETAILS]: characterMock.id.toString() },
    });
  });

  it('triggers an additional API call to fetch detailed information with right URL', async (): Promise<void> => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const Awaited = (await AsyncWrapper({
      searchParams: {
        [SearchParams.NAME]: MOCK_SEARCH_NAME,
        [SearchParams.PAGE]: MOCK_PAGE_NUMBER,
        [SearchParams.DETAILS]: characterMock.id.toString(),
      },
    })) as JSX.Element;

    renderWithProvidersAndUser(Awaited);

    await waitFor(() => expect(fetchSpy).toHaveBeenCalledWith(`${BASE_URL}/${characterMock.id}`));
  });

  it('triggers flyout counter change when input clicked', async (): Promise<void> => {
    global.URL.createObjectURL = vi.fn(() => 'mockedURL');

    const Awaited = (await AsyncWrapper({
      searchParams: {
        [SearchParams.NAME]: MOCK_SEARCH_NAME,
        [SearchParams.PAGE]: MOCK_PAGE_NUMBER,
      },
    })) as JSX.Element;

    const { user } = renderWithProvidersAndUser(Awaited);

    const checkboxes = await screen.findAllByRole('checkbox');
    const counter = screen.getByText(/items selected: 0/i);

    await user.click(checkboxes[0]!);
    await waitFor(() => expect(counter).toHaveTextContent(/items selected: 1/i));

    await user.click(checkboxes[0]!);
    await waitFor(() => expect(counter).toHaveTextContent(/items selected: 0/i));
  });
});
