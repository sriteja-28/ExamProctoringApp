import React, { useState } from 'react';
import { Box, Button, Typography, Input, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Papa from 'papaparse';
import axios from 'axios';

const BulkUploadQuestionsTab = ({ selectedCategory, setSelectedCategory, categories = [] }) => {
  const [csvFile, setCsvFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!csvFile) {
      setUploadStatus('Please select a CSV file.');
      return;
    }
    if (!selectedCategory) {
      setUploadStatus('Please select a category for the questions.');
      return;
    }
    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const questions = results.data.map((row) => ({
          text: row.text,
          optionA: row.optionA,
          optionB: row.optionB,
          optionC: row.optionC,
          optionD: row.optionD,
          correctOption: row.correctOption,
          categoryId: selectedCategory
        }));
        try {
          const token = localStorage.getItem('token');
          await axios.post(
            'http://localhost:5000/api/superadmin/questions/bulk',
            { questions },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUploadStatus('Bulk upload successful.');
        } catch (error) {
          console.error('Bulk upload error:', error);
          setUploadStatus('Bulk upload failed.');
        }
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        setUploadStatus('Error parsing CSV file.');
      }
    });
  };

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6">Bulk Upload Questions</Typography>
      <FormControl sx={{ minWidth: 200, mb: 2 }}>
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
      <Input type="file" accept=".csv" onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handleUpload} sx={{ ml: 2 }}>
        Upload CSV
      </Button>
      {uploadStatus && <Typography sx={{ mt: 2 }}>{uploadStatus}</Typography>}
    </Box>
  );
};

export default BulkUploadQuestionsTab;
