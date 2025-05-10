import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ExamSchedule from '../../pages/ExamSchedule';
import examService from '../../services/examService';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../services/examService');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('ExamSchedule Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
  });

  test('shows loading initially', () => {
    // getScheduledExams never resolves
    examService.getScheduledExams.mockReturnValue(new Promise(() => {}));

    render(
      <BrowserRouter>
        <ExamSchedule />
      </BrowserRouter>
    );

    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  test('shows error on API failure', async () => {
    examService.getScheduledExams.mockRejectedValue(new Error('API error'));

    render(
      <BrowserRouter>
        <ExamSchedule />
      </BrowserRouter>
    );

    expect(await screen.findByText(/error: api error/i)).toBeInTheDocument();
  });

  test('shows "No exams found." when API returns empty array', async () => {
    examService.getScheduledExams.mockResolvedValue([]);

    render(
      <BrowserRouter>
        <ExamSchedule />
      </BrowserRouter>
    );

    expect(await screen.findByText(/no exams found\./i)).toBeInTheDocument();
  });

  test('renders upcoming, started, expired, and submitted exams', async () => {
    const now = new Date();
    const upcoming = {
      id: 'u',
      name: 'Upcoming Exam',
      Category: { name: 'Math' },
      duration: 30,
      date: new Date(now.getTime() + 2 * 60 * 1000).toISOString(), // 2 min in future
      questionsPerSet: 10,
      submitted: false
    };
    const started = {
      id: 's',
      name: 'Started Exam',
      Category: { name: 'Science' },
      duration: 30,
      date: new Date(now.getTime() - 1 * 60 * 1000).toISOString(), // 1 min ago
      questionsPerSet: 20,
      submitted: false
    };
    const expired = {
      id: 'e',
      name: 'Expired Exam',
      Category: { name: 'History' },
      duration: 30,
      date: new Date(now.getTime() - 21 * 60 * 1000).toISOString(), // 21 min ago
      questionsPerSet: 15,
      submitted: false
    };
    const already = {
      id: 'a',
      name: 'Already Submitted Exam',
      Category: { name: 'English' },
      duration: 30,
      date: new Date(now.getTime() - 1 * 60 * 1000).toISOString(),
      questionsPerSet: 12,
      submitted: true
    };

    examService.getScheduledExams.mockResolvedValue([upcoming, started, expired, already]);

    render(
      <BrowserRouter>
        <ExamSchedule />
      </BrowserRouter>
    );

    // Wait for table to render
    expect(await screen.findByText(/exam schedule/i)).toBeInTheDocument();

    // Upcoming
    expect(screen.getByText(/upcoming exam/i)).toBeInTheDocument();
    expect(screen.getByText(/starts in:/i)).toBeInTheDocument();

    // Started
    expect(screen.getByText(/started exam/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start exam/i })).toBeInTheDocument();

    // Expired
    expect(screen.getByText(/expired exam/i)).toBeInTheDocument();
    const expiredBtn = screen.getByRole('button', { name: /expired/i });
    expect(expiredBtn).toBeDisabled();

    // Already Submitted
    expect(screen.getByText(/already submitted exam/i)).toBeInTheDocument();
    const alreadyBtn = screen.getByRole('button', { name: /already submitted/i });
    expect(alreadyBtn).toBeDisabled();
  });

  test('starts an exam successfully and navigates', async () => {
    const now = new Date();
    const started = {
      id: 's',
      name: 'Started Exam',
      Category: { name: 'Science' },
      duration: 30,
      date: new Date(now.getTime() - 1 * 60 * 1000).toISOString(),
      questionsPerSet: 20,
      submitted: false
    };

    examService.getScheduledExams.mockResolvedValue([started]);
    examService.registerExam.mockResolvedValue({}); // success

    render(
      <BrowserRouter>
        <ExamSchedule />
      </BrowserRouter>
    );

    const startBtn = await screen.findByRole('button', { name: /start exam/i });
    fireEvent.click(startBtn);

    await waitFor(() => {
      // registerExam called
      expect(examService.registerExam).toHaveBeenCalledWith(started.id);
      // success alert
      expect(window.alert).toHaveBeenCalledWith('Exam started successfully!');
      // navigation to /exam/:id
      expect(mockNavigate).toHaveBeenCalledWith(`/exam/${started.id}`);
    });
  });

  test('handles "already attempted" error and marks exam submitted', async () => {
    const now = new Date();
    const started = {
      id: 's',
      name: 'Started Exam',
      Category: { name: 'Science' },
      duration: 30,
      date: new Date(now.getTime() - 1 * 60 * 1000).toISOString(),
      questionsPerSet: 20,
      submitted: false
    };

    examService.getScheduledExams.mockResolvedValue([started]);
    examService.registerExam.mockRejectedValue({
      response: { data: { message: 'User has already attempted this exam' } }
    });

    render(
      <BrowserRouter>
        <ExamSchedule />
      </BrowserRouter>
    );

    const startBtn = await screen.findByRole('button', { name: /start exam/i });
    fireEvent.click(startBtn);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Already Submitted');
      expect(screen.getByRole('button', { name: /already submitted/i })).toBeDisabled();
    });
  });
});
