import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { AuthContext } from '../../context/AuthContext';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

// Mock jwtDecode
jest.mock('jwt-decode');

const TestComponent = () => <div>Protected Content</div>;

describe('ProtectedRoute', () => {
  // Helper that renders ProtectedRoute within a MemoryRouter and AuthContext provider
  const renderWithRouterAndContext = (authValue) => {
    return render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <TestComponent />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  test('redirects to "/" if no token is provided', () => {
    const authValue = { auth: { token: null }, logout: jest.fn() };
    renderWithRouterAndContext(authValue);
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });

  test('redirects to "/" if token is expired', async () => {
    const logoutMock = jest.fn();
    const expiredToken = 'expired.token';
    // Simulate jwtDecode returning an expired expiration timestamp
    jwtDecode.mockReturnValue({ exp: (Date.now() - 1000) / 1000 });
    const authValue = { auth: { token: expiredToken }, logout: logoutMock };

    renderWithRouterAndContext(authValue);

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalled();
    });
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });

  test('renders children if token is valid', () => {
    const validToken = 'valid.token';
    // Simulate jwtDecode returning an expiration in the future
    jwtDecode.mockReturnValue({ exp: (Date.now() + 10000) / 1000 });
    const authValue = { auth: { token: validToken }, logout: jest.fn() };

    renderWithRouterAndContext(authValue);
    expect(screen.getByText(/protected content/i)).toBeInTheDocument();
  });

  test('redirects to "/" if jwtDecode throws an error', () => {
    // Simulate jwtDecode throwing an error (invalid token)
    jwtDecode.mockImplementation(() => {
      throw new Error('Invalid token');
    });
    const authValue = { auth: { token: 'invalid.token' }, logout: jest.fn() };

    renderWithRouterAndContext(authValue);
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });
});
