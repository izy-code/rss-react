import '@testing-library/jest-dom';

import { render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';

import * as api from '@/api/api';
import { SearchParams } from '@/common/enums';
import { Details } from '@/components/details/Details';
import { characterMock } from '@/test/mocks/mocks';
import { renderWithUserSetup } from '@/utils/utils';

import { Card } from './Card';

vi.mock('@/components/image-loader/ImageLoader', () => ({
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
    const { user } = renderWithUserSetup(
      <MemoryRouter>
        <Card character={characterMock} />
        <DetailsSearchParamDisplay />
      </MemoryRouter>,
    );

    const linkElement = screen.getByRole('link');

    expect(linkElement).toBeInTheDocument();

    await user.click(linkElement);

    expect(screen.getByTestId(DETAILS_TEST_ID)).toHaveTextContent(characterMock.id.toString());
  });

  it('triggers an additional API call to fetch detailed information when clicked', async (): Promise<void> => {
    const fetchCharacterByIdSpy = vi.spyOn(api, 'fetchCharacterById');

    const { user } = renderWithUserSetup(
      <MemoryRouter initialEntries={[`/?details=${characterMock.id}`]}>
        <Card character={characterMock} />
        <Details />
      </MemoryRouter>,
    );

    const linkElement = screen.getByRole('link');

    await user.click(linkElement);
    await waitFor(() =>
      expect(fetchCharacterByIdSpy).toHaveBeenCalledWith(characterMock.id.toString(), expect.any(AbortController)),
    );
  });
});
