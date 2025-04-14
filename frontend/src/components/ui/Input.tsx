import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface CustomInputProps extends TextFieldProps {
  label: string;
  error?: boolean;
  helperText?: string;
}

const Input: React.FC<CustomInputProps> = ({
  label,
  error,
  helperText,
  ...props
}) => {
  return (
    <TextField
      label={label}
      error={error}
      helperText={helperText}
      fullWidth
      variant="outlined"
      {...props}
    />
  );
};

export default Input; 