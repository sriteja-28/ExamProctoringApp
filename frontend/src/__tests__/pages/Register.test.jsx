import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../../pages/Register';
import { BrowserRouter } from 'react-router-dom';
import authService from '../../services/authService';


jest.mock('../../services/authService');
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}));

describe('Register Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders registration form correctly', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
  });

  test('handles successful registration and navigates to home', async () => {
    authService.register.mockResolvedValue({ userId: '12345' });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'newuser@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'securepass123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith('newuser@example.com', 'securepass123');
      expect(mockedNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('shows error message on failed registration', async () => {
    authService.register.mockRejectedValue(new Error('Registration failed'));

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'failuser@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'failpass' }
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalled();
    });

    expect(await screen.findByText(/registration failed/i)).toBeInTheDocument();
  });
});
