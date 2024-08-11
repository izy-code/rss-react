import { useRouteError } from '@remix-run/react';
import { createRemixStub } from '@remix-run/testing';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import { ErrorPage } from './ErrorPage';

vi.mock('@remix-run/react', async () => {
  const actual = await vi.importActual('@remix-run/react');
  return {
    ...actual,
    useRouteError: vi.fn(),
  };
});

describe('ErrorPage', () => {
  const original = window.location;
  const reloadMock = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: reloadMock },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', { configurable: true, value: original });
  });

  it('displays the error message from errorBoundaryMessage prop', () => {
    const errorBoundaryMessage = 'Boundary error message';

    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: (): ReactNode => <ErrorPage errorBoundaryMessage={errorBoundaryMessage} />,
      },
    ]);

    render(<RemixStub />);

    expect(screen.getByText('Oops!')).toBeInTheDocument();
    expect(screen.getByText('Sorry, an unexpected error has occurred.')).toBeInTheDocument();
    expect(screen.getByText('Boundary error message')).toBeInTheDocument();
  });

  // it('updates errorMessage based on routeError (isRouteErrorResponse)', () => {
  //   (useRouteError as Mock).mockReturnValue(new ErrorResponse(404, 'Not Found', {}));

  //   render(<ErrorPage errorBoundaryMessage={null} />);

  //   expect(screen.getByText('Oops!')).toBeInTheDocument();
  //   expect(screen.getByText('Sorry, an unexpected error has occurred.')).toBeInTheDocument();
  //   expect(screen.getByText('Not Found')).toBeInTheDocument();
  // });

  it('updates errorMessage based on routeError (instance of Error)', () => {
    (useRouteError as Mock).mockReturnValue(new Error('Instance error message'));

    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: (): ReactNode => <ErrorPage errorBoundaryMessage={null} />,
      },
    ]);

    render(<RemixStub />);

    expect(screen.getByText('Oops!')).toBeInTheDocument();
    expect(screen.getByText('Sorry, an unexpected error has occurred.')).toBeInTheDocument();
    expect(screen.getByText('Instance error message')).toBeInTheDocument();
  });

  it('sets errorMessage to null if routeError is not recognized', () => {
    (useRouteError as Mock).mockReturnValue('Unknown error');

    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: (): ReactNode => <ErrorPage errorBoundaryMessage={null} />,
      },
    ]);

    render(<RemixStub />);

    expect(screen.getByText('Oops!')).toBeInTheDocument();
    expect(screen.getByText('Sorry, an unexpected error has occurred.')).toBeInTheDocument();
    expect(screen.queryByText('Error message:')).not.toBeInTheDocument();
  });

  it('reloads the page when the refresh button is clicked', async () => {
    const user = userEvent.setup();

    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: (): ReactNode => <ErrorPage errorBoundaryMessage={null} />,
      },
    ]);

    render(<RemixStub />);

    const refreshButton = screen.getByRole('button', { name: /refresh the page/i });
    await user.click(refreshButton);

    expect(reloadMock).toHaveBeenCalled();
  });
});
