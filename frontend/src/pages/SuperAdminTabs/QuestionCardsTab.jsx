import React from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import axios from 'axios';

const QuestionCardsTab = ({
  categories,
  selectedQuestionCategoryForCards,
  setSelectedQuestionCategoryForCards,
  cardQuestions,
  setCardQuestions, 
  editingQuestionId,
  editingQuestionData,
  setEditingQuestionData, 
  startEditingQuestion,
  cancelEditing,
  updateQuestion,
  deleteQuestion
}) => {
  
  const handleDeleteAllQuestions = async () => {
    if (!selectedQuestionCategoryForCards) {
      alert("Please select a category first.");
      return;
    }
    const confirmDelete = window.confirm("Are you sure you want to delete all questions for this category?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/superadmin/questions/category/${selectedQuestionCategoryForCards}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert("All questions in this category deleted successfully.");
      setCardQuestions([]);
    } catch (error) {
      console.error("Error deleting all questions:", error);
      alert("Error deleting questions for this category.");
    }
  };

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6">Question Cards</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedQuestionCategoryForCards}
            onChange={(e) => setSelectedQuestionCategoryForCards(e.target.value)}
          >
            {categories.map(cat => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button 
          variant="outlined" 
          color="error"
          disabled={!selectedQuestionCategoryForCards || cardQuestions.length === 0}
          onClick={handleDeleteAllQuestions}
        >
          Delete All Questions
        </Button>
      </Box>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
        {cardQuestions.length === 0 ? (
          <Typography variant="body1">No questions found.</Typography>
        ) : (
          cardQuestions.map((q) => (
            <Box key={q.id} sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, width: 300 }}>
              {editingQuestionId === q.id ? (
                <>
                  <TextField
                    label="Question"
                    variant="outlined"
                    value={editingQuestionData.text}
                    onChange={(e) =>
                      setEditingQuestionData({ ...editingQuestionData, text: e.target.value })
                    }
                    fullWidth 
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Option A"
                    variant="outlined"
                    value={editingQuestionData.optionA}
                    onChange={(e) =>
                      setEditingQuestionData({ ...editingQuestionData, optionA: e.target.value })
                    }
                    fullWidth 
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Option B"
                    variant="outlined"
                    value={editingQuestionData.optionB}
                    onChange={(e) =>
                      setEditingQuestionData({ ...editingQuestionData, optionB: e.target.value })
                    }
                    fullWidth 
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Option C"
                    variant="outlined"
                    value={editingQuestionData.optionC}
                    onChange={(e) =>
                      setEditingQuestionData({ ...editingQuestionData, optionC: e.target.value })
                    }
                    fullWidth 
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Option D"
                    variant="outlined"
                    value={editingQuestionData.optionD}
                    onChange={(e) =>
                      setEditingQuestionData({ ...editingQuestionData, optionD: e.target.value })
                    }
                    fullWidth 
                    sx={{ mb: 1 }}
                  />
                  <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel>Correct Answer</InputLabel>
                    <Select
                      value={editingQuestionData.correctOption}
                      onChange={(e) =>
                        setEditingQuestionData({ ...editingQuestionData, correctOption: e.target.value })
                      }
                    >
                      <MenuItem value="A">A</MenuItem>
                      <MenuItem value="B">B</MenuItem>
                      <MenuItem value="C">C</MenuItem>
                      <MenuItem value="D">D</MenuItem>
                    </Select>
                  </FormControl>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" color="primary" onClick={() => updateQuestion(q.id)}>Save</Button>
                    <Button variant="outlined" color="secondary" onClick={cancelEditing}>Cancel</Button>
                  </Box>
                </>
              ) : (
                <>
                  <Typography variant="subtitle1">{q.text}</Typography>
                  <Typography variant="body2">A: {q.optionA}</Typography>
                  <Typography variant="body2">B: {q.optionB}</Typography>
                  <Typography variant="body2">C: {q.optionC}</Typography>
                  <Typography variant="body2">D: {q.optionD}</Typography>
                  <Typography variant="body2">Correct: {q.correctOption}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Button variant="contained" size="small" onClick={() => startEditingQuestion(q)}>Edit</Button>
                    <Button variant="outlined" size="small" color="error" onClick={() => deleteQuestion(q.id)}>Delete</Button>
                  </Box>
                </>
              )}
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default QuestionCardsTab;
