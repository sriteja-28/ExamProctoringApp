import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import QuestionCardsTab from '../../../pages/SuperAdminTabs/QuestionCardsTab';

jest.mock('axios');

describe('QuestionCardsTab Component', () => {
  const theme = createTheme();

  const mockSetSelected = jest.fn();
  const mockSetCardQuestions = jest.fn();
  const mockStartEditing = jest.fn();
  const mockCancelEditing = jest.fn();
  const mockUpdateQuestion = jest.fn();
  const mockDeleteQuestion = jest.fn();

  const defaultProps = {
    categories: [ { id: 1, name: 'Cat1' } ],
    selectedQuestionCategoryForCards: 1,
    setSelectedQuestionCategoryForCards: mockSetSelected,
    cardQuestions: [ { id: 1, text: 'Q1', optionA: 'A', optionB: 'B', optionC: 'C', optionD: 'D', correctOption: 'A' } ],
    setCardQuestions: mockSetCardQuestions,
    editingQuestionId: null,
    editingQuestionData: {},
    setEditingQuestionData: jest.fn(),
    startEditingQuestion: mockStartEditing,
    cancelEditing: mockCancelEditing,
    updateQuestion: mockUpdateQuestion,
    deleteQuestion: mockDeleteQuestion,
    questionCount: 1
  };

  const renderWithTheme = (props) =>
    render(
      <ThemeProvider theme={theme}>
        <QuestionCardsTab {...props} />
      </ThemeProvider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
    window.confirm = jest.fn(() => true);
    axios.delete.mockResolvedValue({});
    localStorage.setItem('token', 'testtoken');
  });

  test('renders select dropdown and Delete All Questions button', () => {
    renderWithTheme(defaultProps);
    // MUI Select roles as combobox
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete All Questions/i })).toBeInTheDocument();
  });

  test('calls API to delete all and clears questions', async () => {
    renderWithTheme(defaultProps);
    fireEvent.click(screen.getByRole('button', { name: /Delete All Questions/i }));
    await waitFor(() => expect(axios.delete).toHaveBeenCalledWith(
      `http://localhost:5000/api/superadmin/questions/category/1`,
      { headers: { Authorization: 'Bearer testtoken' } }
    ));
    expect(mockSetCardQuestions).toHaveBeenCalledWith([]);
  });

  test('renders question card and its Edit/Delete buttons', () => {
    renderWithTheme(defaultProps);
    expect(screen.getByText('Q1')).toBeInTheDocument();
    const editButtons = screen.getAllByRole('button', { name: /^Edit$/i });
    const deleteButtons = screen.getAllByRole('button', { name: /^Delete$/i });
    expect(editButtons.length).toBeGreaterThan(0);
    expect(deleteButtons.length).toBeGreaterThan(0);
  });

  test('starts editing on Edit click', () => {
    renderWithTheme(defaultProps);
    fireEvent.click(screen.getAllByRole('button', { name: /^Edit$/i })[0]);
    expect(mockStartEditing).toHaveBeenCalledWith(defaultProps.cardQuestions[0]);
  });

  test('calls deleteQuestion on card Delete click', () => {
    renderWithTheme(defaultProps);
    const deleteButtons = screen.getAllByRole('button', { name: /^Delete$/i });
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);
    expect(mockDeleteQuestion).toHaveBeenCalledWith(1);
  });
});
