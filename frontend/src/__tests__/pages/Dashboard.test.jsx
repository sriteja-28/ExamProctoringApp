import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../../pages/Dashboard';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const renderWithProviders = (ui, { providerProps, ...renderOptions } = {}) => {
  return render(
    <AuthContext.Provider {...providerProps}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </AuthContext.Provider>,
    renderOptions
  );
};

describe('Dashboard Component', () => {
  test('renders welcome message with user email', () => {
    renderWithProviders(<Dashboard />, {
      providerProps: { value: { auth: { user: { email: 'test@example.com' } } } },
    });
    expect(screen.getByText(/Welcome back, test@example.com!/i)).toBeInTheDocument();
  });

  test('renders buttons for exam schedule and submissions', () => {
    render(
      <AuthContext.Provider
        value={{ auth: { token: 'testtoken123', user: { email: 'test@example.com', name: 'Test User' } } }}
      >
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByRole('link', { name: /View Exam Schedule & Register/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View Submissions/i })).toBeInTheDocument();
  });
});
