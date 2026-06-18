import type { ReactNode, ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: ReactNode;
  className?: string;
  size?: 'sx' | 'sm' | 'md' | 'lg';
  color?: 'success' | 'waring' | 'primary' | 'default' | 'error';
  variant?: 'border' | 'solid' | 'faded';
  rounded?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: ReactNode;
}
