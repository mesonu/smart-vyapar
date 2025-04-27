import React from 'react';
import { Box, Typography, Container, Link, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        marginTop:'10px',
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} SmartShop. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Link
              component={RouterLink}
              to="/about"
              color="text.secondary"
              variant="body2"
            >
              About
            </Link>
            <Link
              component={RouterLink}
              to="/contact"
              color="text.secondary"
              variant="body2"
            >
              Contact
            </Link>
            <Link
              component={RouterLink}
              to="/privacy"
              color="text.secondary"
              variant="body2"
            >
              Privacy Policy
            </Link>
            <Link
              component={RouterLink}
              to="/terms"
              color="text.secondary"
              variant="body2"
            >
              Terms of Service
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer; 