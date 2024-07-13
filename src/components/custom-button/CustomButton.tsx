import clsx from 'clsx';
import type { JSX, ReactNode } from 'react';
import { Component } from 'react';

import styles from './styles.module.scss';

type Props = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'cancel';
  className?: string;
} & JSX.IntrinsicElements['button'];

export class CustomButton extends Component<Props> {
  public render(): ReactNode {
    const { children, variant = 'primary', className, ...rest } = this.props;
    const optionClass = styles[`button--${variant}`];

    return (
      <button className={clsx(styles.button, optionClass, className)} {...rest}>
        {children}
      </button>
    );
  }
}
