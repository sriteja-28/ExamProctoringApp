import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2 },
        textAlign: 'center',
        borderTop: '1px solid #ccc',
        mt: { xs: 2, sm: 4 }
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.875rem' }
        }}
      >
        © {currentYear} All rights reserved. Developed by{' '}
        <Link href="#" target="_blank" rel="noopener" underline="hover">
          Muthangi Sri Teja
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
