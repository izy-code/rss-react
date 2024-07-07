import type { ReactNode } from 'react';
import { Component } from 'react';

import { fetchCharacters } from '@/api/api';
import type { Character } from '@/api/types';
import { Card } from '@/components/card/Card';
import { Loader } from '@/components/loader/Loader';

import styles from './styles.module.scss';

type Props = {
  searchTerm: string;
  onLoadingStateChange: (isLoading: boolean) => void;
  lastSearchTime: Date | null;
  isLoading: boolean;
};

type State = {
  cards: Character[];
};

export class CardList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      cards: [],
    };
  }

  public componentDidMount(): void {
    const { searchTerm } = this.props;

    void this.updateCards(searchTerm);
  }

  public componentDidUpdate(prevProps: Props): void {
    const { lastSearchTime, searchTerm } = this.props;

    if (prevProps.lastSearchTime !== lastSearchTime) {
      void this.updateCards(searchTerm);
    }
  }

  private updateCards = async (searchTerm: string): Promise<void> => {
    const { onLoadingStateChange } = this.props;

    onLoadingStateChange(true);

    try {
      const data = await fetchCharacters(searchTerm);

      if (data) {
        this.setState({ cards: data.results });
      } else {
        this.setState({ cards: [] });
      }
    } catch (error) {
      console.error('Error fetching characters:', error);
    } finally {
      onLoadingStateChange(false);
    }
  };

  public render(): ReactNode {
    const { cards } = this.state;
    const { isLoading } = this.props;

    if (isLoading) {
      return <Loader />;
    }

    if (cards.length === 0) {
      return <div className={styles.noResults}>No characters found</div>;
    }

    return (
      <ul className={styles.list}>
        {cards.map((card) => (
          <Card key={card.id} character={card} />
        ))}
      </ul>
    );
  }
}
