import { createRoutesFromElements, Route } from 'react-router-dom';

import { App } from '@/App';
import { Details } from '@/components/details/Details';
import { ErrorPage } from '@/pages/error-page/ErrorPage';
import { MainPage } from '@/pages/main-page/MainPage';
import { Page404 } from '@/pages/page-404/Page404';

export const routes = createRoutesFromElements(
  <Route path="/" element={<App />} errorElement={<ErrorPage errorBoundaryMessage={null} />}>
    <Route path="" element={<MainPage />}>
      <Route path="" element={<Details />} />
    </Route>
    <Route path="*" element={<Page404 />} />
  </Route>,
);
