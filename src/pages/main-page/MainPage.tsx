import type { ReactNode } from 'react';
import { Component } from 'react';

import { CardList } from '@/components/card-list/CardList';
import { ThrowErrorButton } from '@/components/error-button/ThrowErrorButton';
import { Header } from '@/components/header/Header';
import { Main } from '@/components/main/Main';
import { SearchForm } from '@/components/search-form/SearchForm';

import styles from './styles.module.scss';

type Props = Record<string, never>;

type State = {
  searchTerm: string;
  isLoading: boolean;
  lastSearchTime: Date | null;
};

const LOCAL_STORAGE_KEY = 'searchTerm';

export class MainPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchTerm: localStorage.getItem(LOCAL_STORAGE_KEY) || '',
      isLoading: false,
      lastSearchTime: null,
    };
  }

  private handleSearch = (term: string): void => {
    localStorage.setItem(LOCAL_STORAGE_KEY, term);
    this.setState({ searchTerm: term, lastSearchTime: new Date() });
  };

  private handleLoadingState = (loading: boolean): void => {
    this.setState({ isLoading: loading });
  };

  public render(): ReactNode {
    const { searchTerm, isLoading, lastSearchTime } = this.state;

    return (
      <div className={styles.page}>
        <Header>
          <SearchForm onSearch={this.handleSearch} initialTerm={searchTerm} isLoading={isLoading} />
          <ThrowErrorButton />
        </Header>
        <Main>
          <CardList
            searchTerm={searchTerm}
            onLoadingStateChange={this.handleLoadingState}
            lastSearchTime={lastSearchTime}
            isLoading={isLoading}
          />
        </Main>
      </div>
    );
  }
}
