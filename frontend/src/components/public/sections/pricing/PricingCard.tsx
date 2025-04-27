import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
}

interface PricingCardProps {
  plan: PricingPlan;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan }) => {
  return (
    <Paper
      elevation={plan.popular ? 8 : 2}
      sx={{
        p: 4,
        height: '100%',
        borderRadius: 4,
        position: 'relative',
        border: plan.popular ? '2px solid' : 'none',
        borderColor: plan.popular ? 'primary.main' : 'transparent',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
        },
      }}
    >
      {plan.popular && (
        <Box
          sx={{
            position: 'absolute',
            top: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: 'primary.main',
            color: 'white',
            px: 2,
            py: 0.5,
            borderRadius: 2,
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          Most Popular
        </Box>
      )}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
          {plan.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 800 }}>
            {plan.price}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
            {plan.period}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          {plan.description}
        </Typography>
      </Box>
      <List>
        {plan.features.map((feature, idx) => (
          <ListItem key={idx} sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary={feature} />
          </ListItem>
        ))}
      </List>
      <Button
        fullWidth
        variant={plan.popular ? 'contained' : 'outlined'}
        size="large"
        sx={{
          mt: 3,
          py: 1.5,
          borderRadius: 2,
          fontWeight: 600,
        }}
      >
        Get Started
      </Button>
    </Paper>
  );
};

export default PricingCard; 