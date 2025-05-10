import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Submissions from '../../pages/Submissions';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';


jest.mock('axios');

describe('Submissions Component', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'testtoken123');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('displays "No submissions found." when there are no submissions', async () => {
    axios.get.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <Submissions />
      </MemoryRouter>
    );

    expect(axios.get).toHaveBeenCalledWith(
      'http://localhost:5000/api/user/submissions',
      { headers: { Authorization: 'Bearer testtoken123' } }
    );

    await waitFor(() => {
      expect(screen.getByText(/No submissions found\./i)).toBeInTheDocument();
    });
  });

  test('renders submissions in table when data is present', async () => {
    const mockData = [
      { score: 80, createdAt: '2025-01-01T00:00:00.000Z', Exam: { name: 'Math Test', totalScore: 100 } },
      { score: 50, createdAt: '2025-02-02T12:00:00.000Z', Exam: null }
    ];
    axios.get.mockResolvedValue({ data: mockData });

    render(
      <MemoryRouter>
        <Submissions />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Math Test')).toBeInTheDocument();
    });

    expect(screen.getByText('80')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();

    expect(screen.getAllByText(/2025/)[0]).toBeInTheDocument();

    expect(screen.getAllByText('N/A')[0]).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });
});
