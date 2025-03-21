import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import axios from 'axios';
import StyledTableCell from '../context/StyledTableCell';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/user/submissions', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => setSubmissions(res.data))
      .catch(err => console.error("Error fetching submissions:", err));
  }, []);

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4">Submissions</Typography>
        {submissions.length > 0 ? (
          <Table sx={{ mt: 2 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <StyledTableCell>Exam Name</StyledTableCell>
                <StyledTableCell>Score</StyledTableCell>
                <StyledTableCell>Date</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((submission, idx) => (
                <TableRow key={idx}>
                  <TableCell>{submission.Exam ? submission.Exam.name : 'N/A'}</TableCell>
                  <TableCell>{submission.score}</TableCell>
                  <TableCell>{new Date(submission.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography>No submissions found.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default Submissions;
