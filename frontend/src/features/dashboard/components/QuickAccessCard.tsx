import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText, Divider, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Notifications as NotificationsIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';

interface QuickAccessItem {
  text: string;
  icon: string;
  path: string;
}

interface QuickAccessCardProps {
  title: string;
  items: QuickAccessItem[];
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'inventory':
      return <InventoryIcon />;
    case 'shopping_cart':
      return <ShoppingCartIcon />;
    case 'notifications':
      return <NotificationsIcon />;
    case 'receipt':
      return <ReceiptIcon />;
    case 'trending_up':
      return <TrendingUpIcon />;
    case 'account_balance':
      return <AccountBalanceIcon />;
    default:
      return <InventoryIcon />;
  }
};

const QuickAccessCard: React.FC<QuickAccessCardProps> = ({ title, items }) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          {title}
        </Typography>
        <List>
          {items.map((item, index) => (
            <React.Fragment key={item.text}>
              <ListItem
                component="div"
                onClick={() => navigate(item.path)}
                sx={{
                  py: 1.5,
                  cursor: 'pointer',
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                  {getIcon(item.icon)}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    sx: { fontWeight: 500 }
                  }}
                />
              </ListItem>
              {index < items.length - 1 && <Divider sx={{ my: 0.5 }} />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default QuickAccessCard; 