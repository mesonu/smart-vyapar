import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText, Box, LinearProgress, Chip, Stack } from '@mui/material';
import { TrendingUp as TrendingUpIcon, Star as StarIcon } from '@mui/icons-material';

interface Product {
  id: number;
  name: string;
  sales: number;
  target: number;
}

interface TopProductsCardProps {
  products: Product[];
}

const TopProductsCard: React.FC<TopProductsCardProps> = ({ products }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Top Products
        </Typography>
        <List>
          {products.map((product, idx) => (
            <ListItem key={product.id} alignItems="flex-start" sx={{ py: 1.5, flexDirection: 'column', alignItems: 'stretch' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <TrendingUpIcon color={idx === 0 ? 'warning' : 'primary'} />
                  </ListItemIcon>
                  <Typography variant="subtitle1" fontWeight={600} color={idx === 0 ? 'warning.main' : 'text.primary'}>
                    {product.name}
                  </Typography>
                  {idx === 0 && (
                    <Chip icon={<StarIcon sx={{ color: 'gold' }} />} label="Best Seller" size="small" color="warning" sx={{ ml: 1 }} />
                  )}
                </Stack>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
                  ₹{product.sales.toLocaleString()}
                </Typography>
              </Stack>
              <Box sx={{ mt: 1, mb: 0.5 }}>
                <LinearProgress
                  variant="determinate"
                  value={Math.min((product.sales / product.target) * 100, 100)}
                  sx={{ height: 8, borderRadius: 4, backgroundColor: '#f5f5f5' }}
                  color={idx === 0 ? 'warning' : 'primary'}
                />
              </Box>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default TopProductsCard; 