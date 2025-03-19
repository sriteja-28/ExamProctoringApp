import React, { useContext, useEffect, useState } from 'react';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const Login = () => {
  const { login, auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.role === 'ADMIN') navigate('/admin');
        else if (decoded.role === 'SUPER_ADMIN') navigate('/superadmin');
        else navigate('/dashboard');
      } catch (err) {
        console.error('Token decode error:', err);
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(email, password);
      if (data.token) {
        const decoded = jwtDecode(data.token);

        if (!decoded.isActive) {
          setError('Your account is not active. Please contact support for activation.');
          navigate('/activation-required');
          return;
        }
        

        if (decoded.role === 'ADMIN') navigate('/admin');
        else if (decoded.role === 'SUPER_ADMIN') navigate('/superadmin');
        else navigate('/dashboard');
      } else {
        setError('No token received.');
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        navigate('/activation-required');
      } else {
        setError('Login failed');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
          <Button component={Link} to="/register" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            href="http://localhost:5000/api/auth/google"
          >
            Sign in with Google
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
