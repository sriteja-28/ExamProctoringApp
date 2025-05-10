import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ManageExamsTab from '../../../pages/SuperAdminTabs/ManageExamsTab';

jest.mock('axios');

describe('ManageExamsTab Component', () => {
  const theme = createTheme();

  const mockSetExams = jest.fn();
  const mockSetExamName = jest.fn();
  const mockSetSelectedCategory = jest.fn();
  const mockSetExamDuration = jest.fn();
  const mockSetExamDate = jest.fn();
  const mockSetExamNumberOfSets = jest.fn();
  const mockSetExamQuestionsPerSet = jest.fn();
  const mockScheduleExam = jest.fn().mockResolvedValue();
  const mockRefreshExams = jest.fn();

  
  const futureISO = new Date(Date.now() + 3600000).toISOString();
  const futureInput = futureISO.slice(0,16);

  const defaultProps = {
    exams: [
      {
        id: 1,
        name: 'Exam1',
        Category: { name: 'Cat1' },
        duration: 60,
        date: futureISO,
        numberOfSets: 2,
        questionsPerSet: 10
      }
    ],
    setExams: mockSetExams,
    examName: 'TestExam',
    setExamName: mockSetExamName,
    selectedCategory: 1,
    setSelectedCategory: mockSetSelectedCategory,
    examDuration: 60,
    setExamDuration: mockSetExamDuration,
    examDate: futureInput,
    setExamDate: mockSetExamDate,
    examNumberOfSets: 1,
    setExamNumberOfSets: mockSetExamNumberOfSets,
    examQuestionsPerSet: 5,
    setExamQuestionsPerSet: mockSetExamQuestionsPerSet,
    scheduleExam: mockScheduleExam,
    categories: [{ id: 1, name: 'Cat1', totalQuestions: 20 }],
    refreshExams: mockRefreshExams,
    totalQuestions: 20
  };

  const renderWithTheme = (props = {}) =>
    render(
      <ThemeProvider theme={theme}>
        <ManageExamsTab {...defaultProps} {...props} />
      </ThemeProvider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
    axios.delete.mockResolvedValue({});
    axios.put.mockResolvedValue({});
    localStorage.setItem('token', 'testtoken');
  });

  test('renders all form fields and Schedule Exam button', () => {
    renderWithTheme();
    expect(screen.getByLabelText(/Exam Name/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByLabelText(/Duration \(mins\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Exam Date & Time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Number of Sets/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Questions per Set/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Schedule Exam/i })).toBeInTheDocument();
  });

  //!under testing
  // test('calls scheduleExam when Schedule Exam clicked', async () => {
  //   renderWithTheme();
  //   fireEvent.click(screen.getByRole('button', { name: /Schedule Exam/i }));
  //   await waitFor(() => {
  //     expect(mockScheduleExam).toHaveBeenCalled();
  //   });
  //   expect(await screen.findByText(/Exam scheduled successfully\./i)).toBeInTheDocument();
  // });

  test('deletes an exam on Delete click and shows snackbar', async () => {
    renderWithTheme();
    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        'http://localhost:5000/api/superadmin/exams/1',
        { headers: { Authorization: 'Bearer testtoken' } }
      );
    });
    expect(await screen.findByText(/Exam deleted successfully\./i)).toBeInTheDocument();
  });


//!under testing
  // test('enters edit mode and updates exam date', async () => {
  //   renderWithTheme();
  //   fireEvent.click(screen.getByRole('button', { name: /Edit/i }));

  //   // new date two hours ahead
  //   const twoHoursAheadISO = new Date(Date.now() + 7200000).toISOString();
  //   const twoHoursAheadInput = twoHoursAheadISO.slice(0,16);

  //   const dateInput = screen.getByLabelText(/New Date & Time/i);
  //   fireEvent.change(dateInput, { target: { value: twoHoursAheadInput }});
  //   fireEvent.click(screen.getByRole('button', { name: /Save/i }));

  //   await waitFor(() => {
  //     expect(axios.put).toHaveBeenCalledWith(
  //       'http://localhost:5000/api/superadmin/exams/1',
  //       { date: new Date(twoHoursAheadInput).toISOString() },
  //       { headers: { Authorization: 'Bearer testtoken' } }
  //     );
  //   });
  //   expect(await screen.findByText(/Exam updated successfully\./i)).toBeInTheDocument();
  // });
});
