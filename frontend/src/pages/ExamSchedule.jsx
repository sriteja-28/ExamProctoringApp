import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, Box } from '@mui/material';
import examService from '../services/examService';
import { useNavigate } from 'react-router-dom';

const ExamSchedule = () => {
  const [exams, setExams] = useState([]);
  const [started, setStarted] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchExams = async () => {
    try {
      const examsData = await examService.getScheduledExams();
      console.log('API Response:', examsData);
      if (!examsData) {
        throw new Error("Invalid response from API");
      }
      setExams(examsData || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
      setExams([]);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = async (examId) => {
    try {
      await examService.registerExam(examId);
      setStarted(prev => ({ ...prev, [examId]: true }));
      alert('Exam started successfully!');
      navigate(`/exam/${examId}`);
    } catch (error) {
      console.error('Error starting exam:', error);
      alert('Unable to start exam: ' + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!exams.length) return <p>No exams found.</p>;

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4">Upcoming Exams</Typography>
        <Table sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>Exam Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Duration (mins)</TableCell>
              <TableCell>Exam Date & Time</TableCell>
              <TableCell>Total Questions</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exams.map(exam => {
              const examStartTime = new Date(exam.date);
              const now = new Date();
              const windowEnd = new Date(examStartTime.getTime() + 20 * 60 * 1000);
              
              let actionButton = null;
              if (now < examStartTime) {
                actionButton = <Button variant="outlined" disabled>Not Started Yet</Button>;
              } else if (now > windowEnd) {
                actionButton = <Button variant="outlined" disabled>Expired</Button>;
              } else {
                if (started[exam.id]) {
                  actionButton = <Button variant="outlined" disabled>Started</Button>;
                } else {
                  actionButton = (
                    <Button variant="contained" onClick={() => handleStartExam(exam.id)}>
                      Start Exam
                    </Button>
                  );
                }
              }
              
              return (
                <TableRow key={exam.id}>
                  <TableCell>{exam.name}</TableCell>
                  <TableCell>{exam.Category ? exam.Category.name : '-'}</TableCell>
                  <TableCell>{exam.duration}</TableCell>
                  <TableCell>{new Date(exam.date).toLocaleString()}</TableCell>
                  <TableCell>{exam.questionsPerSet}</TableCell>
                  <TableCell>{actionButton}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
};

export default ExamSchedule;
