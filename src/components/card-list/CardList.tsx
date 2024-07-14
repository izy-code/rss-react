import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { fetchCharacters } from '@/api/api';
import type { Character } from '@/api/types';
import { Card } from '@/components/card/Card';
import { Loader } from '@/components/loader/Loader';

import styles from './CardList.module.scss';

interface Props {
  searchTerm: string;
  onLoadingStateChange: (isLoading: boolean) => void;
  lastSearchTime: Date | null;
  isLoading: boolean;
}

export function CardList({ searchTerm, onLoadingStateChange, lastSearchTime, isLoading }: Props): ReactNode {
  const [cards, setCards] = useState<Character[]>([]);

  useEffect(() => {
    const updateCards = async (): Promise<void> => {
      onLoadingStateChange(true);

      try {
        const data = await fetchCharacters(searchTerm);

        if (data) {
          setCards(data.results);
        } else {
          setCards([]);
        }
      } catch (error) {
        console.error('Error fetching characters:', error);
      } finally {
        onLoadingStateChange(false);
      }
    };

    void updateCards();
  }, [lastSearchTime, searchTerm, onLoadingStateChange]);

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
