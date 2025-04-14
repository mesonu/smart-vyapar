import React from 'react';
import { Card as MuiCard, CardProps, CardContent, CardHeader, CardActions } from '@mui/material';

interface CustomCardProps extends CardProps {
  title?: string;
  subheader?: string;
  actions?: React.ReactNode;
}

const Card: React.FC<CustomCardProps> = ({
  children,
  title,
  subheader,
  actions,
  ...props
}) => {
  return (
    <MuiCard {...props}>
      {title && <CardHeader title={title} subheader={subheader} />}
      <CardContent>{children}</CardContent>
      {actions && <CardActions>{actions}</CardActions>}
    </MuiCard>
  );
};

export default Card; 