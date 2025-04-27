import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Box, LinearProgress, Chip } from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

interface LowStockItem {
  id: number;
  name: string;
  stock: number;
  threshold: number;
}

interface LowStockCardProps {
  items: LowStockItem[];
}

const LowStockCard: React.FC<LowStockCardProps> = ({ items }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Low Stock Items
        </Typography>
        <List>
          {items.map((item) => (
            <ListItem key={item.id} sx={{ py: 0.5 }}>
              <ListItemText
                primary={item.name}
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <LinearProgress
                      variant="determinate"
                      value={(item.stock / item.threshold) * 100}
                      sx={{ flexGrow: 1, mr: 1 }}
                    />
                    <Typography variant="body2" color="error">
                      {item.stock} left
                    </Typography>
                  </Box>
                }
              />
              <Chip
                icon={<WarningIcon />}
                label="Low Stock"
                color="warning"
                size="small"
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default LowStockCard; 