import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import authService from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const data = await authService.register(email, password);
      if (data.userId) navigate('/');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h1" sx={{
          color: "#0B5A72"
        }} gutterBottom>Register</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Email" variant="outlined" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} required />
          <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Register</Button>
          <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
            Already have an account?{" "}
            <Button component={Link} to="/" sx={{ textTransform: "none", p: 0 }}>
              Click here to login
            </Button>
          </Typography>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
