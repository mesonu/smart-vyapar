import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText, Avatar } from '@mui/material';

interface Activity {
  id: number;
  user: string;
  action: string;
  time: string;
  icon: string;
}

interface RecentActivityCardProps {
  activities: Activity[];
}

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ activities }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <List>
          {activities.map((activity) => (
            <ListItem key={activity.id} sx={{ py: 1 }}>
              <ListItemIcon>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {activity.icon}
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2">
                    <strong>{activity.user}</strong> {activity.action}
                  </Typography>
                }
                secondary={activity.time}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard; 