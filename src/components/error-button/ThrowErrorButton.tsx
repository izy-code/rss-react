import type { ReactNode } from 'react';
import { Component } from 'react';

import { CustomButton } from '../custom-button/CustomButton';

type Props = Record<string, never>;

type State = {
  shouldThrowError: boolean;
};

export class ThrowErrorButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      shouldThrowError: false,
    };
  }

  private handleClick(): void {
    this.setState({ shouldThrowError: true });
  }

  public render(): ReactNode {
    const { shouldThrowError } = this.state;

    if (shouldThrowError) {
      throw new Error('Error throwing button was clicked');
    }

    return (
      <CustomButton type="button" variant="cancel" onClick={() => this.handleClick()}>
        Throw error
      </CustomButton>
    );
  }
}
