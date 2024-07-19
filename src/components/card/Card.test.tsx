import '@testing-library/jest-dom';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { fetchCharacterById } from '@/api/api';
import { SearchParams } from '@/common/enums';
import { characterMock } from '@/test/mocks/mocks';

import { Details } from '../details/Details';
import { Card } from './Card';

vi.mock('@/api/api', () => ({
  fetchCharacterById: vi.fn(),
}));

vi.mock('../image-loader/ImageLoader', () => ({
  ImageLoader: ({ imageSrc, imageAlt }: { imageSrc: string; imageAlt: string }): ReactNode => (
    <img src={imageSrc} alt={imageAlt} />
  ),
}));

const DETAILS_TEST_ID = 'details-display';

function DetailsSearchParamDisplay(): ReactNode {
  const location = useLocation();
  const detailsID = new URLSearchParams(location.search).get(SearchParams.DETAILS);

  return <p data-testid={DETAILS_TEST_ID}>{detailsID}</p>;
}

describe('Card Component', () => {
  const user = userEvent.setup();

  it('renders the relevant card data', (): void => {
    render(
      <MemoryRouter>
        <Card character={characterMock} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: characterMock.name })).toBeInTheDocument();
    expect(screen.getByAltText(characterMock.name)).toHaveAttribute('src', characterMock.image);
  });

  it('changes URL search params when clicked', async (): Promise<void> => {
    const { container } = render(
      <MemoryRouter>
        <Card character={characterMock} />
        <DetailsSearchParamDisplay />
      </MemoryRouter>,
    );

    const linkElement = container.querySelector('a');
    expect(linkElement).toBeInTheDocument();

    if (linkElement) {
      await user.click(linkElement);

      expect(screen.getByTestId(DETAILS_TEST_ID)).toHaveTextContent(characterMock.id.toString());
    }
  });

  it('triggers an additional API call to fetch detailed information when clicked', async (): Promise<void> => {
    const fetchCharacterByIdMock = vi.mocked(fetchCharacterById);
    fetchCharacterByIdMock.mockResolvedValue({
      status: 'success',
      data: characterMock,
    });

    render(
      <MemoryRouter initialEntries={[`/?details=${characterMock.id}`]}>
        <Card character={characterMock} />
        <Details />
      </MemoryRouter>,
    );

    const linkElement = screen.getByRole('heading', { name: characterMock.name }).closest('a');

    if (linkElement) {
      await user.click(linkElement);
      await waitFor(() =>
        expect(fetchCharacterByIdMock).toHaveBeenCalledWith(characterMock.id.toString(), expect.any(AbortController)),
      );
    }
  });
});
