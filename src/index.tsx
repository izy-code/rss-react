import './index.scss';

import ReactDOM from 'react-dom/client';

import { App } from '@/App';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
