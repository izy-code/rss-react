import { screen } from '@testing-library/react';

import { SearchParams } from '@/common/enums';
import { characterMock } from '@/test/mocks/mocks';
import { renderWithProvidersAndUser } from '@/utils/test-utils';

import { Details } from './Details';

const mockedRouterPush = vi.fn();

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation');
  return {
    ...actual,
    useRouter: (): {
      push: () => void;
    } => ({ push: mockedRouterPush }),
    useSearchParams: vi.fn(() => {
      const searchParams = new URLSearchParams({ [SearchParams.DETAILS]: characterMock.id.toString() });
      return searchParams;
    }),
  };
});

describe('Details Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('displays a loading indicator while fetching image', async () => {
    renderWithProvidersAndUser(<Details character={{ status: 'success', data: characterMock }} />);

    expect(await screen.findByRole('heading', { name: /loading.../i })).toBeInTheDocument();
  });

  it('displays the detailed card data correctly', async () => {
    renderWithProvidersAndUser(<Details character={{ status: 'success', data: characterMock }} />);

    expect(await screen.findByText(characterMock.name)).toBeInTheDocument();
    expect(screen.getByText(characterMock.species)).toBeInTheDocument();
    expect(screen.getByText(characterMock.status)).toBeInTheDocument();
    expect(screen.getByText(characterMock.gender)).toBeInTheDocument();
  });

  it('hides the details section when the close button is clicked by deleting the query param', async () => {
    const { user } = renderWithProvidersAndUser(<Details character={{ status: 'success', data: characterMock }} />);

    const closeButton = await screen.findByRole('button', { name: /close details/i });

    expect(closeButton).toBeInTheDocument();

    await user.click(closeButton);

    expect(mockedRouterPush).toHaveBeenCalledWith('?');
  });
});
