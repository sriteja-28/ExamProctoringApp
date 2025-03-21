import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Snackbar,
} from '@mui/material';
import axios from 'axios';
import StyledTableCell from '../../context/StyledTableCell';

const ManageExamsTab = ({
  exams,
  setExams,
  examName,
  setExamName,
  selectedCategory,
  setSelectedCategory,
  examDuration,
  setExamDuration,
  examDate,
  setExamDate,
  examNumberOfSets,
  setExamNumberOfSets,
  examQuestionsPerSet,
  setExamQuestionsPerSet,
  scheduleExam,
  categories,
  refreshExams,
  totalQuestions
}) => {
  const [editingExamId, setEditingExamId] = useState(null);
  const [newExamDate, setNewExamDate] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const sortedExams = [...exams].sort((a, b) => new Date(b.date) - new Date(a.date));


  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDeleteExam = async (examId) => {
    try {
      await axios.delete(`http://localhost:5000/api/superadmin/exams/${examId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSnackbarMsg('Exam deleted successfully.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      if (setExams) {
        setExams(prevExams => prevExams.filter(exam => exam.id !== examId));
      } else if (refreshExams) {
        refreshExams();
      }
    } catch (error) {
      console.error("Error deleting exam:", error);
      setSnackbarMsg('Error deleting exam.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };




  const handleUpdateExam = async (examId) => {
    const newTime = new Date(newExamDate);
    if (newTime <= new Date()) {
      alert("Updated exam time must be in the future");
      return;
    }
    const isoDate = newTime.toISOString();
    try {
      await axios.put(`http://localhost:5000/api/superadmin/exams/${examId}`, {
        date: isoDate,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEditingExamId(null);
      setNewExamDate('');
      if (refreshExams) refreshExams();
      setSnackbarMsg('Exam updated successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating exam:", error);
      setSnackbarMsg('Error updating exam.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const formatDateForInput = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    const hours = (`0${date.getHours()}`).slice(-2);
    const minutes = (`0${date.getMinutes()}`).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleScheduleExam = async () => {
    if (!examName.trim()) {
      alert("Exam name is required.");
      return;
    }

    if (exams.some(exam => exam.name.trim().toLowerCase() === examName.trim().toLowerCase())) {
      alert("An exam with this name already exists. Please choose a different name.");
      return;
    }

    const selectedDate = new Date(examDate);
    if (selectedDate <= new Date()) {
      alert("Exam date & time must be in the future.");
      return;
    }

    if (Number(examDuration) < 20) {
      alert("Exam duration must be at least 20 minutes.");
      return;
    }

    if (Number(examDuration) > 180) {
      alert("Exam duration should be less than 3Hrs (Max 180 minutes only).");
      return;
    }

    const numSets = Number(examNumberOfSets);
    const desiredQuestionsPerSet = Number(examQuestionsPerSet);
  
    if (isNaN(numSets) || numSets < 1) {
      alert("There must be at least 1 set.");
      return;
    }
    if (isNaN(desiredQuestionsPerSet) || desiredQuestionsPerSet < 1) {
      alert("There must be at least 1 question per set.");
      return;
    }
    const selectedCategoryObj = categories.find(cat => cat.id === selectedCategory);
    if (!selectedCategoryObj) {
      alert("Selected category not found.");
      return;
    }

    const availableQuestions = Number(selectedCategoryObj.totalQuestions);
    if (isNaN(availableQuestions)) {
      alert("The available questions for the selected category is invalid.");
      return;
    }

  const maxQuestionsPerSet = Math.floor(availableQuestions / numSets);
  if (desiredQuestionsPerSet > maxQuestionsPerSet) {
    alert(
      `Total questions available in the category is ${availableQuestions}. For ${numSets} sets, the maximum questions per set allowed is ${maxQuestionsPerSet}.`
    );
    setExamQuestionsPerSet(maxQuestionsPerSet);
    return;
  }

    try {
      await scheduleExam();
      setSnackbarMsg('Exam scheduled successfully.');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error("Error scheduling exam:", error);
      setSnackbarMsg('Failed to schedule exam. Please try again.');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };


  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6">Manage Exams</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
        <TextField
          label="Exam Name"
          variant="outlined"
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
          sx={{ mr: 2, mb: 2 }}
        />
        <FormControl sx={{ minWidth: 200, mr: 2, mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Duration (mins)"
          variant="outlined"
          type="number"
          value={examDuration}
          onChange={(e) => setExamDuration(e.target.value)}
          sx={{ mr: 2, mb: 2 }}
        />
        <TextField
          label="Exam Date & Time"
          variant="outlined"
          type="datetime-local"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ mr: 2, mb: 2 }}
          inputProps={{ min: new Date().toISOString().slice(0, 16) }}
        />
        <TextField
          label="Number of Sets"
          variant="outlined"
          type="number"
          value={examNumberOfSets}
          onChange={(e) => setExamNumberOfSets(e.target.value)}
          sx={{ mr: 2, mb: 2 }}
        />
        <TextField
          label="Questions per Set"
          variant="outlined"
          type="number"
          value={examQuestionsPerSet}
          onChange={(e) => setExamQuestionsPerSet(e.target.value)}
          sx={{ mr: 2, mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleScheduleExam} sx={{ mb: 2 }}>
          Schedule Exam
        </Button>
      </Box>

      <Typography variant="h6" sx={{ mt: 3 }}>Scheduled Exams</Typography>
      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Category</StyledTableCell>
            <StyledTableCell>Duration</StyledTableCell>
            <StyledTableCell>Date & Time</StyledTableCell>
            <StyledTableCell>Number of Sets</StyledTableCell>
            <StyledTableCell>No of Questions</StyledTableCell>
            <StyledTableCell>Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {sortedExams.map(exam => (
            <TableRow key={exam.id}>
              <TableCell>{exam.id}</TableCell>
              <TableCell>{exam.name}</TableCell>
              <TableCell>{exam.Category ? exam.Category.name : '-'}</TableCell>
              <TableCell>{exam.duration} mins</TableCell>
              <TableCell>{new Date(exam.date).toLocaleString()}</TableCell>
              <TableCell>{exam.numberOfSets}</TableCell>
              <TableCell>{exam.questionsPerSet}</TableCell>
              <TableCell>
                {editingExamId === exam.id ? (
                  <>
                    <TextField
                      label="New Date & Time"
                      type="datetime-local"
                      value={newExamDate}
                      onChange={(e) => setNewExamDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{ mr: 1 }}
                    />
                    <Button variant="contained" color="primary" onClick={() => handleUpdateExam(exam.id)}>
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => { setEditingExamId(null); setNewExamDate(''); }}
                      sx={{ ml: 1 }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => { setEditingExamId(exam.id); setNewExamDate(formatDateForInput(exam.date)); }}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteExam(exam.id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMsg}
        ContentProps={{
          sx: {
            backgroundColor:
              snackbarSeverity === 'success'
                ? 'green'
                : snackbarSeverity === 'error'
                  ? 'red'
                  : 'orange',
          },
        }}
      />
    </Box>
  );
};

export default ManageExamsTab;
