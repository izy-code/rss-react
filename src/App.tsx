import type { ReactNode } from 'react';
import { Component } from 'react';

import { MainPage } from '@/pages/main-page/MainPage';

export class App extends Component {
  public render(): ReactNode {
    return <MainPage />;
  }
}
