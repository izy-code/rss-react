import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import type { NextRouter } from 'next/router';
import { type FC, type PropsWithChildren, type ReactElement, type ReactNode, useRef } from 'react';
import { Provider } from 'react-redux';

import type { AppStore, RootState } from '@/store/store';
import { makeStore, setupStore } from '@/store/store';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

export function renderWithProvidersAndUser(
  ui: ReactElement,
  { preloadedState = {}, store = setupStore(preloadedState), ...renderOptions }: ExtendedRenderOptions = {},
): { store: AppStore; user: ReturnType<typeof userEvent.setup>; container: HTMLElement } {
  function Wrapper({ children }: PropsWithChildren): ReactElement {
    const storeRef = useRef<AppStore>();

    if (!storeRef.current) {
      storeRef.current = makeStore();
    }

    return <Provider store={storeRef.current}>{children}</Provider>;
  }

  return { store, user: userEvent.setup(), ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export function renderWithUserSetup(ui: ReactElement): {
  user: ReturnType<typeof userEvent.setup>;
  container: HTMLElement;
} {
  return {
    user: userEvent.setup(),
    ...render(ui),
  };
}

function createMockedNextRouter(router: Partial<NextRouter>): NextRouter {
  return {
    basePath: '',
    pathname: '/',
    route: '/',
    query: {},
    asPath: '/',
    back: vi.fn(),
    beforePopState: vi.fn(),
    prefetch: vi.fn(),
    push: vi.fn(),
    reload: vi.fn(),
    replace: vi.fn(),
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    defaultLocale: 'en',
    domainLocales: [],
    isPreview: false,
    forward: vi.fn(),
    ...router,
  };
}

export const getMockedNextRouter: (nextRouterProps?: Partial<NextRouter>) => {
  nextRouter: NextRouter;
  NextProvider: FC<{ children: ReactNode }>;
} = (nextRouterProps = {}) => {
  const nextRouter = createMockedNextRouter(nextRouterProps);

  return {
    nextRouter,
    NextProvider: ({ children }) => <RouterContext.Provider value={nextRouter}>{children}</RouterContext.Provider>,
  };
};
