import '@testing-library/jest-dom';

import { MemoryRouter } from '@remix-run/react';
import { screen } from '@testing-library/react';

import { SearchParams } from '@/common/enums';
import { charactersDataMock } from '@/test/mocks/mocks';
import { MOCK_PAGE_NUMBER, MOCK_SEARCH_NAME } from '@/test/msw/handlers';
import { renderWithProvidersAndUser } from '@/utils/test-utils';

import { CardList } from './CardList';

describe('CardList Component', () => {
  afterEach((): void => {
    vi.clearAllMocks();
  });

  it('renders the specified number of cards', async (): Promise<void> => {
    renderWithProvidersAndUser(
      <MemoryRouter initialEntries={[`/?page=${MOCK_PAGE_NUMBER}&name=${MOCK_SEARCH_NAME}`]}>
        <CardList />
      </MemoryRouter>,
    );

    const cards = await screen.findAllByRole('listitem');
    expect(cards).toHaveLength(charactersDataMock.info.count);
  });

  it('displays an appropriate message if no cards are present', async (): Promise<void> => {
    renderWithProvidersAndUser(
      <MemoryRouter initialEntries={[`/?name=wrong`]}>
        <CardList />
      </MemoryRouter>,
    );

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
      <MemoryRouter initialEntries={[`/?${SearchParams.NAME}=${MOCK_SEARCH_NAME}`]}>
        <CardList />
      </MemoryRouter>,
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
