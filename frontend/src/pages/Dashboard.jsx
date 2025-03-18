import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4">User Dashboard</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Check the upcoming exams and register below.
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }} component={Link} to="/exam-schedule">
          View Exam Schedule & Register
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;
