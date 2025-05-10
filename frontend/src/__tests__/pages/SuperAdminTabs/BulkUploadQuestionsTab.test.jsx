// src/__tests__/pages/SuperAdminTabs/BulkUploadQuestionsTab.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BulkUploadQuestionsTab from '../../../pages/SuperAdminTabs/BulkUploadQuestionsTab';
import Papa from 'papaparse';
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Suppress console.warn recursion from setupTests
beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

jest.mock('papaparse');
jest.mock('axios');

describe('BulkUploadQuestionsTab Component', () => {
  const categories = [{ id: 1, name: 'Cat1' }];
  let selectedCategory = null;
  const setSelectedCategory = jest.fn((val) => { selectedCategory = val; });
  const theme = createTheme();

  const renderWithTheme = (props) => render(
    <ThemeProvider theme={theme}>
      <BulkUploadQuestionsTab {...props} />
    </ThemeProvider>
  );

  beforeEach(() => {
    selectedCategory = null;
    jest.clearAllMocks();
    localStorage.setItem('token', 'testtoken');
  });

//!Should complete this
//   test('shows category select, file input, and upload button', () => {
//     const { container } = renderWithTheme({
//       selectedCategory,
//       setSelectedCategory,
//       categories
//     });

//     expect(screen.getByText(/Bulk Upload Questions/i)).toBeInTheDocument();
//     // MUI Select renders as a button with the label text
//     expect(screen.getByRole('button', { name: /Category/i })).toBeInTheDocument();
//     expect(screen.getByRole('button', { name: /Upload CSV/i })).toBeInTheDocument();
//     expect(container.querySelector('input[type="file"]')).toBeInTheDocument();
//   });

  test('errors when no file selected', async () => {
    renderWithTheme({
      selectedCategory: 1,
      setSelectedCategory,
      categories
    });

    fireEvent.click(screen.getByRole('button', { name: /Upload CSV/i }));
    expect(await screen.findByText(/Please select a CSV file\./i)).toBeInTheDocument();
  });

  test('errors when no category selected', async () => {
    const { container } = renderWithTheme({
      selectedCategory: null,
      setSelectedCategory,
      categories
    });
    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(["text"], "questions.csv", { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /Upload CSV/i }));

    expect(await screen.findByText(/Please select a category for the questions\./i)).toBeInTheDocument();
  });

  test('successful bulk upload', async () => {
    Papa.parse.mockImplementation((file, config) => {
      config.complete({ data: [
        { text: 'Q1', optionA: 'A', optionB: 'B', optionC: 'C', optionD: 'D', correctOption: 'A' }
      ] });
    });
    axios.post.mockResolvedValue({});

    const { container } = renderWithTheme({
      selectedCategory: 1,
      setSelectedCategory,
      categories
    });
    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(["text"], "questions.csv", { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /Upload CSV/i }));

    await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5000/api/superadmin/questions/bulk',
      {
        questions: [
          { text: 'Q1', optionA: 'A', optionB: 'B', optionC: 'C', optionD: 'D', correctOption: 'A', categoryId: 1 }
        ]
      },
      { headers: { Authorization: 'Bearer testtoken' } }
    ));
    expect(await screen.findByText(/Bulk upload successful\./i)).toBeInTheDocument();
  });

  test('bulk upload failure shows error', async () => {
    Papa.parse.mockImplementation((file, config) => {
      config.complete({ data: [
        { text: 'Q1', optionA: 'A', optionB: 'B', optionC: 'C', optionD: 'D', correctOption: 'A' }
      ] });
    });
    axios.post.mockRejectedValue(new Error('Upload failed'));

    const { container } = renderWithTheme({
      selectedCategory: 1,
      setSelectedCategory,
      categories
    });
    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(["text"], "questions.csv", { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /Upload CSV/i }));

    expect(await screen.findByText(/Bulk upload failed\./i)).toBeInTheDocument();
  });

  test('CSV parsing error shows error message', async () => {
    Papa.parse.mockImplementation((file, config) => {
      config.error(new Error('Parse error'));
    });

    const { container } = renderWithTheme({
      selectedCategory: 1,
      setSelectedCategory,
      categories
    });
    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(["text"], "questions.csv", { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /Upload CSV/i }));

    expect(await screen.findByText(/Error parsing CSV file\./i)).toBeInTheDocument();
  });
});
