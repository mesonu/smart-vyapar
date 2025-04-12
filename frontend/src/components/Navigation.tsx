import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Store as StoreIcon,
  Receipt as ReceiptIcon,
  People as PeopleIcon,
  Mic as MicIcon,
  AccountBalance as AccountBalanceIcon,
  ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // This should come from your auth context

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Inventory', icon: <StoreIcon />, path: '/inventory' },
    { text: 'Billing', icon: <ReceiptIcon />, path: '/billing' },
    { text: 'Customers', icon: <PeopleIcon />, path: '/customers' },
    { text: 'Voice Commands', icon: <MicIcon />, path: '/voice-commands' },
    { text: 'GST Compliance', icon: <AccountBalanceIcon />, path: '/gst' },
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Smart Shop
          </Typography>
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  sx={{
                    backgroundColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
          {isAuthenticated ? (
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => { navigate('/settings'); handleClose(); }}>
                  Settings
                </MenuItem>
                <MenuItem onClick={() => { setIsAuthenticated(false); handleClose(); }}>
                  <ListItemIcon>
                    <ExitToAppIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {isMobile && (
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
};

export default Navigation; 