import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UNSAFE_ErrorResponseImpl, useRouteError } from 'react-router-dom';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import { ErrorPage } from './ErrorPage';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
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

    render(<ErrorPage errorBoundaryMessage={errorBoundaryMessage} />);

    expect(screen.getByText('Oops!')).toBeInTheDocument();
    expect(screen.getByText('Sorry, an unexpected error has occurred.')).toBeInTheDocument();
    expect(screen.getByText('Boundary error message')).toBeInTheDocument();
  });

  it('updates errorMessage based on routeError (isRouteErrorResponse)', () => {
    (useRouteError as Mock).mockReturnValue(new UNSAFE_ErrorResponseImpl(404, 'Not Found', {}));

    render(<ErrorPage errorBoundaryMessage={null} />);

    expect(screen.getByText('Oops!')).toBeInTheDocument();
    expect(screen.getByText('Sorry, an unexpected error has occurred.')).toBeInTheDocument();
    expect(screen.getByText('Not Found')).toBeInTheDocument();
  });

  it('updates errorMessage based on routeError (instance of Error)', () => {
    (useRouteError as Mock).mockReturnValue(new Error('Instance error message'));

    render(<ErrorPage errorBoundaryMessage={null} />);

    expect(screen.getByText('Oops!')).toBeInTheDocument();
    expect(screen.getByText('Sorry, an unexpected error has occurred.')).toBeInTheDocument();
    expect(screen.getByText('Instance error message')).toBeInTheDocument();
  });

  it('sets errorMessage to null if routeError is not recognized', () => {
    (useRouteError as Mock).mockReturnValue('Unknown error');

    render(<ErrorPage errorBoundaryMessage={null} />);

    expect(screen.getByText('Oops!')).toBeInTheDocument();
    expect(screen.getByText('Sorry, an unexpected error has occurred.')).toBeInTheDocument();
    expect(screen.queryByText('Error message:')).not.toBeInTheDocument();
  });

  it('reloads the page when the refresh button is clicked', async () => {
    const user = userEvent.setup();

    render(<ErrorPage errorBoundaryMessage={null} />);

    const refreshButton = screen.getByRole('button', { name: /refresh the page/i });
    await user.click(refreshButton);

    expect(reloadMock).toHaveBeenCalled();
  });
});
