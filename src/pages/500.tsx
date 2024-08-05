import type { ReactNode } from 'react';

import ErrorStatusPage from '@/components/error-status-page/ErrorStatusPage';

export default function Page404(): ReactNode {
  return <ErrorStatusPage status={500} message="Server-side error occurred." />;
}
