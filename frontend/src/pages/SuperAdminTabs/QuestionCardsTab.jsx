import React from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';

const QuestionCardsTab = ({
  categories,
  selectedQuestionCategoryForCards,
  setSelectedQuestionCategoryForCards,
  cardQuestions,
  editingQuestionId,
  editingQuestionData,
  setEditingQuestionData, 
  startEditingQuestion,
  cancelEditing,
  updateQuestion,
  deleteQuestion
}) => {
  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6">Question Cards</Typography>
      <FormControl sx={{ minWidth: 200, mr: 2 }}>
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
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
        {cardQuestions.map((q) => (
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
                  fullWidth sx={{ mb: 1 }}
                />
                <TextField
                  label="Option A"
                  variant="outlined"
                  value={editingQuestionData.optionA}
                  onChange={(e) =>
                    setEditingQuestionData({ ...editingQuestionData, optionA: e.target.value })
                  }
                  fullWidth sx={{ mb: 1 }}
                />
                <TextField
                  label="Option B"
                  variant="outlined"
                  value={editingQuestionData.optionB}
                  onChange={(e) =>
                    setEditingQuestionData({ ...editingQuestionData, optionB: e.target.value })
                  }
                  fullWidth sx={{ mb: 1 }}
                />
                <TextField
                  label="Option C"
                  variant="outlined"
                  value={editingQuestionData.optionC}
                  onChange={(e) =>
                    setEditingQuestionData({ ...editingQuestionData, optionC: e.target.value })
                  }
                  fullWidth sx={{ mb: 1 }}
                />
                <TextField
                  label="Option D"
                  variant="outlined"
                  value={editingQuestionData.optionD}
                  onChange={(e) =>
                    setEditingQuestionData({ ...editingQuestionData, optionD: e.target.value })
                  }
                  fullWidth sx={{ mb: 1 }}
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
        ))}
      </Box>
    </Box>
  );
};

export default QuestionCardsTab;
