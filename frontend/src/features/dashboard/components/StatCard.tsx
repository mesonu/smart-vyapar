import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ color, backgroundColor: `${color}15`, p: 1, borderRadius: '50%' }}>
          {icon}
        </Box>
      </Box>
      <Typography variant="h4" component="div" sx={{ mb: 1 }}>
        {value}
      </Typography>
      {trend && (
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
          <TrendingUpIcon fontSize="small" />
          <Typography variant="body2" sx={{ ml: 0.5 }}>
            {trend}
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

export default StatCard; 