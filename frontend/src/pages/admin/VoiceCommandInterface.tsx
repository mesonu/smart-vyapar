import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface Command {
  id: string;
  text: string;
  timestamp: Date;
}

const VoiceCommandInterface: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [commands, setCommands] = useState<Command[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const startListening = () => {
    setIsListening(true);
    setIsProcessing(true);
    // Mock voice recognition
    setTimeout(() => {
      const newCommand: Command = {
        id: Date.now().toString(),
        text: 'Show inventory status for product ID 123',
        timestamp: new Date(),
      };
      setCommands(prev => [newCommand, ...prev]);
      setIsProcessing(false);
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
    setIsProcessing(false);
  };

  const deleteCommand = (id: string) => {
    setCommands(prev => prev.filter(cmd => cmd.id !== id));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Voice Command Interface
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h6">Voice Commands</Typography>
          <Button
            variant="contained"
            color={isListening ? 'secondary' : 'primary'}
            startIcon={isListening ? <MicOffIcon /> : <MicIcon />}
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
          >
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </Button>
        </Box>

        {isProcessing && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
          </Box>
        )}

        <List>
          {commands.map((command) => (
            <ListItem
              key={command.id}
              secondaryAction={
                <IconButton edge="end" onClick={() => deleteCommand(command.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={command.text}
                secondary={command.timestamp.toLocaleString()}
              />
            </ListItem>
          ))}
          {commands.length === 0 && !isProcessing && (
            <ListItem>
              <ListItemText
                primary="No commands yet"
                secondary="Click the microphone button to start voice commands"
              />
            </ListItem>
          )}
        </List>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Available Commands
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Inventory Commands"
              secondary="Show inventory status, check stock levels, view low stock items"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Billing Commands"
              secondary="Show revenue, check pending payments, view invoice status"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Customer Commands"
              secondary="View customer details, check purchase history, show customer behavior"
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default VoiceCommandInterface; 