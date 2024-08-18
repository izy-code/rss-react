import { createRoutesFromElements, Route } from 'react-router-dom';

import { RoutePath } from '@/common/enums';
import { ErrorPage } from '@/pages/error-page/ErrorPage';
import { MainPage } from '@/pages/main-page/MainPage';
import { Page404 } from '@/pages/page-404/Page404';
import { ReactHookForm } from '@/pages/react-hook-form/ReactHookForm';
import { UncontrolledForm } from '@/pages/uncontrolled-form/UncontrolledForm';

export const routes = createRoutesFromElements(
  <Route path="/" errorElement={<ErrorPage errorBoundaryMessage={null} />}>
    <Route index element={<MainPage />} />
    <Route path={RoutePath.UNCONTROLLED_FORM} element={<UncontrolledForm />} />
    <Route path={RoutePath.REACT_HOOK_FORM} element={<ReactHookForm />} />
    <Route path="*" element={<Page404 />} />
  </Route>,
);
