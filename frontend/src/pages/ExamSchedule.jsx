import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, Box } from '@mui/material';
import examService from '../services/examService';
import { useNavigate } from 'react-router-dom';
import StyledTableCell from '../context/StyledTableCell';

const ExamSchedule = () => {
  const [exams, setExams] = useState([]);
  const [started, setStarted] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [now, setNow] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchExams = async () => {
    try {
      const examsData = await examService.getScheduledExams();
     // console.log('API Response:', examsData);
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
      const message = error.response?.data?.message || error.message;
      if (message.toLowerCase().includes("already attempted")) {
        setExams(prev =>
          prev.map(exam =>
            exam.id === examId ? { ...exam, submitted: true } : exam
          )
        );
        alert("Already Submitted");
      } else {
        alert('Unable to start exam: ' + message);
      }
    }
  };

  
  const formatCountdown = (seconds) => {
    if (seconds < 60) return `${seconds} s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (minutes < 60) return `${minutes} min ${secs} s`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hr ${remainingMinutes} min ${secs} s`;
  };

  useEffect(() => {
    fetchExams();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!exams.length) return <p>No exams found.</p>;

  
  const upcomingExams = exams.filter(exam => new Date(exam.date) > now);
  const pastExams = exams.filter(exam => new Date(exam.date) <= now);
  upcomingExams.sort((a, b) => new Date(a.date) - new Date(b.date));
  pastExams.sort((a, b) => new Date(b.date) - new Date(a.date));
  const sortedExams = [...upcomingExams, ...pastExams];

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4">Exam Schedule</Typography>
        <Table sx={{ mt: 2 }}>
          <TableHead>
             <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <StyledTableCell>Exam Name</StyledTableCell>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell>Duration (mins)</StyledTableCell>
              <StyledTableCell>Exam Date & Time</StyledTableCell>
              <StyledTableCell>Total Questions</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedExams.map((exam) => {
              const examStartTime = new Date(exam.date);
              const windowEnd = new Date(examStartTime.getTime() + 20 * 60 * 1000);
              const diffToStart = Math.max(0, Math.floor((examStartTime - now) / 1000));
              const diffToExpiry = Math.max(0, Math.floor((windowEnd - now) / 1000));
              let actionElement = null;

              
              if (exam.submitted) {
                actionElement = <Button variant="outlined" disabled>Already Submitted</Button>;
              }
              
              else if (now < examStartTime) {
                actionElement = (
                  <Box>
                    <Typography variant="body2">
                      Starts in: {formatCountdown(diffToStart)}
                    </Typography>
                  </Box>
                );
              }
              
              else if (now >= examStartTime && now <= windowEnd) {
                actionElement = (
                  <Box>
                    <Button variant="contained" onClick={() => handleStartExam(exam.id)}>
                      Start Exam
                    </Button>
                    <Typography variant="caption" display="block">
                      Expires in: {formatCountdown(diffToExpiry)}
                    </Typography>
                  </Box>
                );
              }
              
              else {
                actionElement = <Button variant="outlined" disabled>Expired</Button>;
              }

              return (
                <TableRow key={exam.id}>
                  <TableCell>{exam.name}</TableCell>
                  <TableCell>{exam.Category ? exam.Category.name : '-'}</TableCell>
                  <TableCell>{exam.duration}</TableCell>
                  <TableCell>{new Date(exam.date).toLocaleString()}</TableCell>
                  <TableCell>{exam.questionsPerSet}</TableCell>
                  <TableCell>{actionElement}</TableCell>
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
