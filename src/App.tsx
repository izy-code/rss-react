import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { routes } from '@/router/routes';
import { store } from '@/store/store';

export function App(): ReactNode {
  const browserRouter = createBrowserRouter(routes);

  return (
    <Provider store={store}>
      <RouterProvider router={browserRouter} />
    </Provider>
  );
}
