import './index.scss';

import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { store } from '@/store/store';

import { ThemeProvider } from './contexts/ThemeContext';
import { routes } from './router/routes';

const browserRouter = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={browserRouter} />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
