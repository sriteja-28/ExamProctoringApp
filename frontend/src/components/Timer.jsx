import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

const Timer = ({ initialSeconds, onTimeUp }) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) {
      onTimeUp();
      return;
    }
    const interval = setInterval(() => setSeconds(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [seconds, onTimeUp]);

  return (
    <Typography 
      variant="h6" 
      sx={{
        fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
        textAlign: 'center',
        p: { xs: 1, sm: 2 }
      }}
    >
      Time Remaining: {seconds} seconds
    </Typography>
  );
};

export default Timer;
