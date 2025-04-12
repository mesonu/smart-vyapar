import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  useTheme,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

const LandingFooter: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.grey[100],
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              SmartShop
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Transform your small business with our all-in-one management solution.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Product
            </Typography>
            <Link href="#features" color="inherit" display="block">
              Features
            </Link>
            <Link href="#pricing" color="inherit" display="block">
              Pricing
            </Link>
            <Link href="#demo" color="inherit" display="block">
              Demo
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Company
            </Typography>
            <Link href="#about" color="inherit" display="block">
              About
            </Link>
            <Link href="#contact" color="inherit" display="block">
              Contact
            </Link>
            <Link href="#careers" color="inherit" display="block">
              Careers
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Follow Us
            </Typography>
            <Box>
              <IconButton color="inherit" href="https://facebook.com">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" href="https://twitter.com">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" href="https://linkedin.com">
                <LinkedInIcon />
              </IconButton>
              <IconButton color="inherit" href="https://instagram.com">
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Box mt={4}>
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            {new Date().getFullYear()}
            {' SmartShop. All rights reserved.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingFooter; 