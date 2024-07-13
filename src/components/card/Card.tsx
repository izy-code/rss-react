import type { ReactNode } from 'react';
import { Component } from 'react';

import type { Character } from '@/api/types';

import styles from './styles.module.scss';

interface Props {
  character: Character;
}

export class Card extends Component<Props> {
  public render(): ReactNode {
    const { character } = this.props;

    return (
      <li className={styles.card}>
        <img className={styles.image} src={character.image} alt={character.name} />
        <h2 className={styles.title}>{character.name}</h2>
        <div className={styles.propsContainer}>
          <p className={styles.prop}>
            <span className={styles.param}>Species:</span> {character.species}
          </p>
          <p className={styles.prop}>
            <span className={styles.param}>Status:</span> {character.status}
          </p>
          <p className={styles.prop}>
            <span className={styles.param}>Gender:</span> {character.gender}
          </p>
          <p className={styles.prop}>
            <span className={styles.param}>Episodes count:</span> {character.episode.length}
          </p>
          <p className={styles.prop}>
            <span className={styles.param}>Origin:</span> {character.origin.name}
          </p>
          <p className={styles.prop}>
            <span className={styles.param}>Location:</span> {character.location.name}
          </p>
        </div>
      </li>
    );
  }
}
