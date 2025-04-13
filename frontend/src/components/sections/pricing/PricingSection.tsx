import React from 'react';
import { Container, Typography, Grid } from '@mui/material';
import PricingCard from './PricingCard';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
}

interface PricingSectionProps {
  title?: string;
  subtitle?: string;
  plans: PricingPlan[];
}

const PricingSection: React.FC<PricingSectionProps> = ({
  title = 'Simple, Transparent Pricing',
  subtitle = 'Choose the perfect plan for your business needs',
  plans,
}) => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography
        variant="h6"
        align="center"
        sx={{ mb: 6, maxWidth: 800, mx: 'auto', color: 'text.secondary' }}
      >
        {subtitle}
      </Typography>
      <Grid container spacing={4} alignItems="stretch">
        {plans.map((plan, index) => (
          <Grid item xs={12} md={4} key={index}>
            <PricingCard plan={plan} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PricingSection; 