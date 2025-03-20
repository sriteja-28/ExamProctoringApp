import React from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import StyledTableCell from '../../context/StyledTableCell';

const SetQuestionsTab = ({
  categories,
  selectedQuestionCategory,
  setSelectedQuestionCategory,
  questionText,
  setQuestionText,
  optionA,
  setOptionA,
  optionB,
  setOptionB,
  optionC,
  setOptionC,
  optionD,
  setOptionD,
  correctOption,
  setCorrectOption,
  addQuestion,
  questions
}) => {
  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6">Set Questions</Typography>
      <FormControl sx={{ minWidth: 200, mr: 2 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={selectedQuestionCategory}
          onChange={(e) => setSelectedQuestionCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Question"
        variant="outlined"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        sx={{ display: "block", my: 2, width: "100%" }}
      />
      <TextField label="Option A" variant="outlined" value={optionA} onChange={(e) => setOptionA(e.target.value)} sx={{ mr: 2 }} />
      <TextField label="Option B" variant="outlined" value={optionB} onChange={(e) => setOptionB(e.target.value)} sx={{ mr: 2 }} />
      <TextField label="Option C" variant="outlined" value={optionC} onChange={(e) => setOptionC(e.target.value)} sx={{ mr: 2 }} />
      <TextField label="Option D" variant="outlined" value={optionD} onChange={(e) => setOptionD(e.target.value)} sx={{ mr: 2 }} />
      <FormControl sx={{ minWidth: 200, mt: 2 }}>
        <InputLabel>Correct Answer</InputLabel>
        <Select value={correctOption} onChange={(e) => setCorrectOption(e.target.value)}>
          <MenuItem value="A">A</MenuItem>
          <MenuItem value="B">B</MenuItem>
          <MenuItem value="C">C</MenuItem>
          <MenuItem value="D">D</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={addQuestion} sx={{ mt: 2 }}>
        Add Question
      </Button>
      <Typography variant="h6" sx={{ mt: 3 }}>Questions for Selected Category</Typography>
      <Table sx={{ mt: 2 }}>
        <TableHead>
           <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell>Question</StyledTableCell>
            <StyledTableCell>Option A</StyledTableCell>
            <StyledTableCell>Option B</StyledTableCell>
            <StyledTableCell>Option C</StyledTableCell>
            <StyledTableCell>Option D</StyledTableCell>
            <StyledTableCell>Correct Answer</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.map((q) => (
            <TableRow key={q.id}>
              <TableCell>{q.id}</TableCell>
              <TableCell>{q.text}</TableCell>
              <TableCell>{q.optionA}</TableCell>
              <TableCell>{q.optionB}</TableCell>
              <TableCell>{q.optionC}</TableCell>
              <TableCell>{q.optionD}</TableCell>
              <TableCell>{q.correctOption}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default SetQuestionsTab;
