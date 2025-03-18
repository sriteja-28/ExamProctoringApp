import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ px: { xs: 1, sm: 2 } }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } 
          }}
        >
          Exam App
        </Typography>
        {auth.token ? (
          <Button 
            color="inherit" 
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        ) : (
          <Button 
            color="inherit" 
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            component={Link} 
            to="/"
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
