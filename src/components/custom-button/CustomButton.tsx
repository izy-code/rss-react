import clsx from 'clsx';
import type { ReactNode } from 'react';
import { Component } from 'react';

import styles from './styles.module.scss';

type Props = {
  children: ReactNode;
  type?: 'submit' | 'reset' | 'button';
  variant?: 'primary' | 'secondary' | 'tertiary' | 'cancel';
  onClick?: VoidFunction;
  className?: string;
  isDisabled?: boolean;
  id?: string;
};

export class CustomButton extends Component<Props> {
  public render(): ReactNode {
    const {
      children,
      type = 'button',
      variant = 'primary',
      onClick,
      className,
      isDisabled = false,
      id = '',
    } = this.props;
    const optionClass = styles[`button--${variant}`];

    return (
      <button
        className={clsx(styles.button, optionClass, className)}
        type={type}
        onClick={onClick}
        disabled={isDisabled}
        id={id}
      >
        {children}
      </button>
    );
  }
}
