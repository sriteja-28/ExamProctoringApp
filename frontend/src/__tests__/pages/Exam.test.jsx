import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Exam from '../../pages/Exam';
import examService from '../../services/examService';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

jest.mock('../../services/examService');


const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'exam123' }),
  useNavigate: () => mockedNavigate,
}));

jest.mock('../../components/VideoProctor', () => {
  const React = require('react');
  return function MockVideoProctor(props) {
    React.useEffect(() => {
      props.onPermissionsGranted(true);
    }, [props.onPermissionsGranted]);
    return React.createElement('div', { 'data-testid': 'video-proctor' });
  };
});

describe('Exam Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
  });

  function renderExam() {
    return render(
      <MemoryRouter initialEntries={['/exam/exam123']}>
        <Routes>
          <Route path="/exam/:id" element={<Exam />} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );
  }

  test('renders start screen initially', () => {
    renderExam();
    expect(screen.getByRole('heading', { name: /exam/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start exam/i })).toBeInTheDocument();
  });

  test('starts exam and loads questions', async () => {
    examService.registerExam.mockResolvedValue({});
    examService.getExam.mockResolvedValue({
      name: 'Sample Exam',
      duration: 1,
      questionSet: [
        { id: 'q1', text: 'Q1?', optionA: 'A', optionB: 'B', optionC: 'C', optionD: 'D' },
      ],
    });

    renderExam();

    const startBtn = await screen.findByRole('button', { name: /start exam/i });
    fireEvent.click(startBtn);

    expect(examService.registerExam).toHaveBeenCalledWith('exam123');
    expect(await screen.findByText(/q1\?/i)).toBeInTheDocument();
  });

  test('alerts if submitting while questions still loading', async () => {
    examService.registerExam.mockResolvedValue({});
    examService.getExam.mockReturnValue(new Promise(() => {}));

    renderExam();
    const startBtn = await screen.findByRole('button', { name: /start exam/i });
    fireEvent.click(startBtn);

    const submitBtn = await screen.findByRole('button', { name: /submit exam/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Questions are still loading. Please wait.');
    });
  });

  test('alerts on unanswered questions', async () => {
    examService.registerExam.mockResolvedValue({});
    examService.getExam.mockResolvedValue({
      name: 'Sample Exam',
      duration: 1,
      questionSet: [
        { id: 'q1', text: 'Q1?', optionA: 'A', optionB: 'B', optionC: 'C', optionD: 'D' },
        { id: 'q2', text: 'Q2?', optionA: 'A', optionB: 'B', optionC: 'C', optionD: 'D' },
      ],
    });

    renderExam();
    const startBtn = await screen.findByRole('button', { name: /start exam/i });
    fireEvent.click(startBtn);
    await screen.findByText(/q2\?/i);

    
    const [firstAOption] = screen.getAllByLabelText('A');
    fireEvent.click(firstAOption);

    fireEvent.click(screen.getByRole('button', { name: /submit exam/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Please answer question number 2 to submit.');
    });
  });

  test('submits exam successfully and navigates', async () => {
    examService.registerExam.mockResolvedValue({});
    examService.getExam.mockResolvedValue({
      name: 'Sample Exam',
      duration: 1,
      questionSet: [
        { id: 'q1', text: 'Q1?', optionA: 'A', optionB: 'B', optionC: 'C', optionD: 'D' },
      ],
    });
    examService.submitExam.mockResolvedValue({});

    renderExam();
    const startBtn = await screen.findByRole('button', { name: /start exam/i });
    fireEvent.click(startBtn);
    await screen.findByText(/q1\?/i);

    fireEvent.click(screen.getByLabelText('B'));
    fireEvent.click(screen.getByRole('button', { name: /submit exam/i }));

    await waitFor(() => {
      expect(examService.submitExam).toHaveBeenCalledWith(
        'exam123',
        expect.objectContaining({ answers: { q1: 'B' }, score: 0 })
      );
      expect(window.alert).toHaveBeenCalledWith('Exam submitted successfully!');
      expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('cancels exam after 3 tab switches', async () => {
    examService.registerExam.mockResolvedValue({});
    examService.getExam.mockResolvedValue({
      name: 'Sample Exam',
      duration: 1,
      questionSet: [],
    });
    examService.cancelExam.mockResolvedValue({});

    renderExam();
    const startBtn = await screen.findByRole('button', { name: /start exam/i });
    fireEvent.click(startBtn);

    
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });

    await act(async () => {
      document.dispatchEvent(new Event('visibilitychange'));
      document.dispatchEvent(new Event('visibilitychange'));
      document.dispatchEvent(new Event('visibilitychange'));
    });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining('Exam cancelled due to excessive tab switching.')
      );
      expect(examService.cancelExam).toHaveBeenCalledWith('exam123', { status: 'cancelled' });
      expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
