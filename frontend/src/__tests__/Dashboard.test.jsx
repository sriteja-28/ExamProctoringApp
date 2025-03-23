import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const testAuth = {
  token: 'testtoken123',
  user: { email: 'test@example.com', name: 'Test User' },
};

describe('Dashboard Component', () => {
  test('renders welcome message with user name', () => {
    render(
      <AuthContext.Provider value={{ auth: testAuth }}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/Welcome back, Test User!/i)).toBeInTheDocument();
  });

  test('renders buttons for exam schedule and submissions', () => {
    render(
      <AuthContext.Provider value={{ auth: testAuth }}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByRole('button', { name: /View Exam Schedule & Register/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View Submissions/i })).toBeInTheDocument();
  });
});
