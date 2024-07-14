import { createRoutesFromElements, Route } from 'react-router-dom';

import { App } from '@/App';
import { MainPage } from '@/pages/main-page/MainPage';
import { Page404 } from '@/pages/page-404/Page404';

export const routes = createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route path="" element={<MainPage />}>
      <Route path="" element={<p>Details</p>} />
    </Route>
    <Route path="*" element={<Page404 />} />
  </Route>,
);
