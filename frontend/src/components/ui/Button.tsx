import React from 'react';
import { Button as MuiButton, ButtonProps } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
}

const Button: React.FC<CustomButtonProps> = ({
  children,
  variant = 'contained',
  size = 'medium',
  fullWidth = false,
  loading = false,
  ...props
}) => {
  return (
    <MuiButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </MuiButton>
  );
};

export default Button; 