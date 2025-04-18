import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import examService from '../services/examService';
import VideoProctor from '../components/VideoProctor';
import { useParams, useNavigate } from 'react-router-dom';

const Exam = () => {
  const { id: examId } = useParams();
  const navigate = useNavigate();

  
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [answers, setAnswers] = useState({});
  const [examCancelled, setExamCancelled] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [questionSet, setQuestionSet] = useState([]); // Single set of questions
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [examName, setExamName] = useState('Exam'); // Default name

 
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };


  useEffect(() => {
    if (examStarted && timer > 0 && !examCancelled) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && examStarted && !examCancelled) {
      handleSubmit();
    }
  }, [examStarted, timer, examCancelled]);

  
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden) {
        setTabSwitchCount(prevCount => {
          const newCount = prevCount + 1;
          alert(`Warning: Do not switch tabs during the exam! (${newCount}/3)`);
          if (newCount >= 3) {
            alert("Exam cancelled due to excessive tab switching.");
            setExamCancelled(true);
            examService.cancelExam(examId, { status: "cancelled" })
              .catch(error => console.error('Error cancelling exam:', error));
            navigate('/dashboard');
          }
          return newCount;
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [examId, navigate]);


  
  useEffect(() => {
    if (examStarted) {
      setLoadingQuestions(true);
      examService.getExam(examId)
        .then(examData => {
          console.log("Fetched exam data:", examData);
          setTimer((examData.duration || 20) * 60);
          setQuestionSet(examData.questionSet || []);
          setExamName(examData.name || 'Exam');
          setLoadingQuestions(false);
        })
        .catch(error => {
          console.error('Error fetching exam details', error);
          setLoadingQuestions(false);
        });
    }
  }, [examStarted, examId]);

  
  const handlePermissions = (granted) => {
    console.log(`Permissions granted: ${granted}`);
    setPermissionsGranted(granted);
  };

  
  const handleAnswer = (questionId, selectedOption) => {
    setAnswers(prev => ({ ...prev, [questionId]: selectedOption }));
  };

 
  const handleStartExam = async () => {
    try {
      await examService.registerExam(examId);
      setExamStarted(true);
    } catch (error) {
      console.error('Error starting exam:', error);
      alert('Unable to start exam. ' + (error.response?.data?.message || ''));
    }
  };

 
  const handleSubmit = async () => {
    if (loadingQuestions || questionSet.length === 0) {
      alert('Questions are still loading. Please wait.');
      return;
    }

    const unansweredQuestions = questionSet.filter(question => !answers[question.id]);
    if (unansweredQuestions.length > 0) {
      if (unansweredQuestions.length === 1) {
        const questionNumber = questionSet.indexOf(unansweredQuestions[0]) + 1;
        alert(`Please answer question number ${questionNumber} to submit.`);
      } else {
        const questionNumbers = unansweredQuestions
          .map(question => questionSet.indexOf(question) + 1)
          .join(', ');
        alert(`Please answer questions number ${questionNumbers} to submit.`);
      }
      return;
    }

    try {
      await examService.submitExam(examId, { answers, score: 0 });
      alert('Exam submitted successfully!');
      setExamSubmitted(true);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting exam', error);
      alert('Error submitting exam. ' + (error.response?.data?.message || ''));
    }
  };

  return (
    <Container>
      {examStarted && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          background: '#fff',
          p: 1,
          boxShadow: 2,
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6">{examName}</Typography>
          <Typography variant="h6">Time Remaining: {formatTime(timer)}</Typography>
          <Box sx={{ width: '150px', height: '80px' }}>
            <VideoProctor onPermissionsGranted={() => {}} />
          </Box>
        </Box>
      )}

      <Box sx={{ mt: examStarted ? 12 : 4 }}>
        {!permissionsGranted ? (
          <Box>
            <Typography variant="h6">
              Enable your camera and microphone to begin:
            </Typography>
            <VideoProctor onPermissionsGranted={handlePermissions} />
          </Box>
        ) : (
          !examStarted ? (
            <Box>
              <Typography variant="h4">Exam</Typography>
              <Button variant="contained" color="primary" onClick={handleStartExam} sx={{ mt: 2 }}>
                Start Exam
              </Button>
            </Box>
          ) : (
            <Box>
              {loadingQuestions ? (
                <Typography variant="body1">Loading questions...</Typography>
              ) : (
                questionSet.length > 0 ? (
                  questionSet.map((question, index) => (
                    <Box key={question.id} sx={{ my: 2 }}>
                      <Typography variant="body1">
                        {index + 1}. {question.text}
                      </Typography>
                      <RadioGroup
                        name={`question-${question.id}`}
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswer(question.id, e.target.value)}
                      >
                        <FormControlLabel value="A" control={<Radio />} label={question.optionA} />
                        <FormControlLabel value="B" control={<Radio />} label={question.optionB} />
                        <FormControlLabel value="C" control={<Radio />} label={question.optionC} />
                        <FormControlLabel value="D" control={<Radio />} label={question.optionD} />
                      </RadioGroup>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body1">No questions available for this exam.</Typography>
                )
              )}
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={examCancelled || examSubmitted}>
                  Submit Exam
                </Button>
              </Box>
            </Box>
          )
        )}
      </Box>
    </Container>
  );
};

export default Exam;
