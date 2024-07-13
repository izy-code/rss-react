import classNames from 'classnames';
import type { ReactNode } from 'react';

import styles from './styles.module.scss';

interface Props {
  children: ReactNode;
  type?: 'submit' | 'reset' | 'button';
  variant?: 'primary' | 'secondary' | 'tertiary' | 'cancel';
  onClick?: VoidFunction;
  className?: string;
  isDisabled?: boolean;
  id?: string;
}

export function CustomButton({
  children,
  type = 'button',
  variant = 'primary',
  onClick,
  className,
  isDisabled = false,
  id = '',
}: Props): JSX.Element {
  const optionClass = styles[`button--${variant}`];

  return (
    <button
      className={classNames(styles.button, optionClass, className)}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      id={id}
    >
      {children}
    </button>
  );
}
