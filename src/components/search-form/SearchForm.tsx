import type { FormEvent, ReactNode } from 'react';
import { Component, createRef } from 'react';

import { CustomButton } from '../custom-button/CustomButton';
import styles from './styles.module.scss';

type Props = {
  onSearch: (term: string) => void;
  initialTerm: string;
  isLoading: boolean;
};

export class SearchForm extends Component<Props> {
  private inputRef = createRef<HTMLInputElement>();

  public componentDidMount(): void {
    this.inputRef.current?.focus();
  }

  public componentDidUpdate(prevProps: Props): void {
    const { isLoading } = this.props;

    if (prevProps.isLoading && !isLoading) {
      this.inputRef.current?.focus();
    }
  }

  private handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (event.target instanceof HTMLFormElement) {
      const { onSearch } = this.props;
      const formData = new FormData(event.target);

      onSearch(formData.get('search')?.toString().trim() || '');
    }
  };

  public render(): ReactNode {
    const { isLoading, initialTerm } = this.props;

    return (
      <form className={styles.form} onSubmit={this.handleSubmit}>
        <input
          ref={this.inputRef}
          className={styles.input}
          type="search"
          placeholder="Enter character name…"
          defaultValue={initialTerm}
          name="search"
          disabled={isLoading}
          autoComplete="off"
        />
        <CustomButton type="submit" variant="secondary" isDisabled={isLoading}>
          Search
        </CustomButton>
      </form>
    );
  }
}
