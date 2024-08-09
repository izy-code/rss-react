import { screen } from '@testing-library/react';

import { charactersDataMock } from '@/test/mocks/mocks';
import { renderWithProvidersAndUser } from '@/utils/test-utils';

import { CardList } from './CardList';

describe('CardList Component', () => {
  afterEach(() => {
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

  it('renders the specified number of cards', async (): Promise<void> => {
    renderWithProvidersAndUser(<CardList characters={{ status: 'success', data: charactersDataMock }} />);

    const cards = await screen.findAllByRole('listitem');

    expect(cards).toHaveLength(charactersDataMock.info.count);
  });

  it('displays an appropriate message if no cards are present', async (): Promise<void> => {
    renderWithProvidersAndUser(<CardList characters={{ status: 'empty' }} />);

    const message = await screen.findByText('No characters found');
    expect(message).toBeInTheDocument();
  });

  it('should select items and update flyout accordingly', async () => {
    vi.mock('@/utils/utils', async () => {
      const actual = await vi.importActual('@/utils/utils');
      return {
        ...actual,
        getCsvObjectUrl: vi.fn(() => 'blob:fake-url'),
      };
    });

    const { user } = renderWithProvidersAndUser(
      <CardList characters={{ status: 'success', data: charactersDataMock }} />,
    );

    const checkboxes = await screen.findAllByRole('checkbox');
    expect(checkboxes.length).toBe(3);

    checkboxes.forEach(async (checkbox) => {
      await user.click(checkbox);
    });

    expect(await screen.findByText(/items selected: 3/i)).toBeInTheDocument();

    const unselectAllButton = screen.getByRole('button', { name: /unselect all/i });
    await user.click(unselectAllButton);

    expect(screen.getByText(/items selected: 0/i)).toBeInTheDocument();
  });
});
