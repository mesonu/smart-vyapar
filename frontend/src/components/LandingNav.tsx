import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const LandingNav: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Features', href: '#features' },
    { text: 'Pricing', href: '#pricing' },
    { text: 'Contact', href: '#contact' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            button
            component="a"
            href={item.href}
            sx={{ textAlign: 'center' }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 'bold' }}
        >
          SmartShop
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              variant="temporary"
              anchor="right"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                href={item.href}
                sx={{ textTransform: 'none' }}
              >
                {item.text}
              </Button>
            ))}
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default LandingNav; 