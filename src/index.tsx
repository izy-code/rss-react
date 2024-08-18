import './index.scss';

import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { App } from '@/App';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
