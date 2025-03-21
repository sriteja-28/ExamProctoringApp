import React, { useContext } from 'react';
import { Container, Typography, Button, Box, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { auth } = useContext(AuthContext);
  const userEmail = auth?.user?.email || 'User';

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4">User Dashboard</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Welcome back, {userEmail}! From here, you can view upcoming exam schedules and review your submissions.
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Button variant="contained" color="primary" fullWidth component={Link} to="/exam-schedule">
              View Exam Schedule & Register
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button variant="contained" color="info" fullWidth component={Link} to="/submissions">
              View Submissions
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
