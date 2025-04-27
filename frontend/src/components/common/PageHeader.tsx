import React from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; path: string }[];
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, breadcrumbs }) => {
  return (
    <Box sx={{ mb: 4 }}>
      {breadcrumbs && (
        <Breadcrumbs sx={{ mb: 1 }}>
          <Link
            component={RouterLink}
            to="/dashboard"
            sx={{ display: 'flex', alignItems: 'center' }}
            color="inherit"
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
            Dashboard
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <Link
              key={index}
              component={RouterLink}
              to={crumb.path}
              color={index === breadcrumbs.length - 1 ? 'text.primary' : 'inherit'}
              sx={{ textDecoration: 'none' }}
            >
              {crumb.label}
            </Link>
          ))}
        </Breadcrumbs>
      )}
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>
      {subtitle && (
        <Typography color="text.secondary" paragraph>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default PageHeader; 