import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import {
  Menu as MenuIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LandingNav = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesAnchorEl, setServicesAnchorEl] = useState<null | HTMLElement>(null);

  const handleServicesClick = (event: React.MouseEvent<HTMLElement>) => {
    setServicesAnchorEl(event.currentTarget);
  };

  const handleServicesClose = () => {
    setServicesAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const services = [
    { title: 'Inventory Management', path: '/services/inventory' },
    { title: 'Billing & Invoicing', path: '/services/billing' },
    { title: 'Analytics & Reports', path: '/services/analytics' },
    { title: 'Customer Management', path: '/services/customer' },
    { title: 'GST Compliance', path: '/services/gst' },
  ];

  const navigationItems = [
    { title: 'About Us', path: '/about' },
    { title: 'Services', path: '#', hasDropdown: true },
    { title: 'Pricing', path: '/pricing' },
    { title: 'Contact', path: '/contact' },
  ];

  const drawer = (
    <Box sx={{ p: 2 }}>
      <List>
        {navigationItems.map((item) => (
          <React.Fragment key={item.title}>
            <ListItem 
              component="button" 
              onClick={() => {
                if (!item.hasDropdown) {
                  navigate(item.path);
                  setMobileOpen(false);
                }
              }}
            >
              <ListItemText primary={item.title} />
            </ListItem>
            {item.hasDropdown && services.map((service) => (
              <ListItem 
                component="button" 
                key={service.title}
                sx={{ pl: 4 }}
                onClick={() => {
                  navigate(service.path);
                  setMobileOpen(false);
                }}
              >
                <ListItemText primary={service.title} />
              </ListItem>
            ))}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      color="inherit" 
      elevation={0}
      sx={{ 
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              color: 'primary.main',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            SmartShop
          </Typography>

          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Stack direction="row" spacing={1} alignItems="center">
              {navigationItems.map((item) => (
                <Box key={item.title}>
                  {item.hasDropdown ? (
                    <>
                      <Button
                        color="inherit"
                        onClick={handleServicesClick}
                        endIcon={<KeyboardArrowDownIcon />}
                      >
                        {item.title}
                      </Button>
                      <Menu
                        anchorEl={servicesAnchorEl}
                        open={Boolean(servicesAnchorEl)}
                        onClose={handleServicesClose}
                        slotProps={{
                          paper: {
                            'aria-labelledby': 'services-button'
                          }
                        }}
                      >
                        {services.map((service) => (
                          <MenuItem 
                            key={service.title}
                            onClick={() => {
                              navigate(service.path);
                              handleServicesClose();
                            }}
                          >
                            {service.title}
                          </MenuItem>
                        ))}
                      </Menu>
                    </>
                  ) : (
                    <Button
                      color="inherit"
                      onClick={() => navigate(item.path)}
                    >
                      {item.title}
                    </Button>
                  )}
                </Box>
              ))}
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/login')}
                sx={{
                  ml: 2,
                  px: 3,
                  borderRadius: 2,
                }}
              >
                Login
              </Button>
            </Stack>
          )}
        </Toolbar>
      </Container>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default LandingNav; 