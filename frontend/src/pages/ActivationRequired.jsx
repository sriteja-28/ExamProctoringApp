import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ActivationRequired = () => {
  const navigate = useNavigate();

  const handleContactSupport = () => {
    window.open('mailto:support@example.com?subject=Account Activation', '_blank');
  };

  // const handleContactSupport = () => {
  //   window.open('https://mail.google.com/mail/?view=cm&fs=1&to=support@example.com&su=Account%20Activation', '_blank');
  // };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Account Not Active
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Your account is not active. Please contact support for activation.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleContactSupport}>
          Contact Support
        </Button>
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/')}>
            Return to Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ActivationRequired;
