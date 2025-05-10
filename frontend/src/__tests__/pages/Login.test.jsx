import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../../pages/Login';
import { AuthContext } from '../../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import jwtDecode from 'jwt-decode';


jest.mock('jwt-decode');

const renderWithProviders = (ui, { providerProps, ...renderOptions } = {}) => {
  return render(
    <AuthContext.Provider {...providerProps}>
      <BrowserRouter>{ui}</BrowserRouter>
    </AuthContext.Provider>,
    renderOptions
  );
};

describe('Login Page', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    jwtDecode.mockReset();
  });

  test('renders the login form', () => {
    const providerProps = {
      value: {
        login: jest.fn(),
        auth: {}
      }
    };

    renderWithProviders(<Login />, { providerProps });
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in with google/i })).toBeInTheDocument();
  });

  test('redirects based on token present in localStorage', () => {
    const token = 'mock.token.value';
    localStorage.setItem('token', token);
    jwtDecode.mockReturnValue({ role: 'ADMIN' });

    const providerProps = {
      value: {
        login: jest.fn(),
        auth: {}
      }
    };

    renderWithProviders(<Login />, { providerProps });
    expect(jwtDecode).toHaveBeenCalledWith(token);
    const { mockedNavigate } = require('../../setupTests');
    expect(mockedNavigate).toHaveBeenCalledWith('/admin');
  });

  test('handles successful login and navigates based on role', async () => {
    const mockLogin = jest.fn().mockResolvedValue({ token: 'new.mock.token' });
    const providerProps = {
      value: {
        login: mockLogin,
        auth: {}
      }
    };

    jwtDecode.mockReturnValue({ isActive: true, role: 'SUPER_ADMIN' });

    renderWithProviders(<Login />, { providerProps });

   
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });

   
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'password123');
    });
    expect(jwtDecode).toHaveBeenCalledWith('new.mock.token');
    const { mockedNavigate } = require('../../setupTests');
    expect(mockedNavigate).toHaveBeenCalledWith('/superadmin');
  });

  test('displays error when no token is received', async () => {
    const mockLogin = jest.fn().mockResolvedValue({});
    const providerProps = {
      value: {
        login: mockLogin,
        auth: {}
      }
    };

    renderWithProviders(<Login />, { providerProps });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'password123');
    });
    expect(await screen.findByText(/no token received/i)).toBeInTheDocument();
  });

  test('redirects to activation page if account is not active', async () => {
    const mockLogin = jest.fn().mockResolvedValue({ token: 'inactive.token' });
    const providerProps = {
      value: {
        login: mockLogin,
        auth: {}
      }
    };

    jwtDecode.mockReturnValue({ isActive: false, role: 'USER' });

    renderWithProviders(<Login />, { providerProps });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'password123');
    });
    expect(await screen.findByText(/your account is not active/i)).toBeInTheDocument();
    const { mockedNavigate } = require('../../setupTests');
    expect(mockedNavigate).toHaveBeenCalledWith('/activation-required');
  });

  test('redirects to activation page on 403 error response', async () => {
    const error = { response: { status: 403 } };
    const mockLogin = jest.fn().mockRejectedValue(error);
    const providerProps = {
      value: {
        login: mockLogin,
        auth: {}
      }
    };

    renderWithProviders(<Login />, { providerProps });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'password123');
    });
    const { mockedNavigate } = require('../../setupTests');
    expect(mockedNavigate).toHaveBeenCalledWith('/activation-required');
  });
});
