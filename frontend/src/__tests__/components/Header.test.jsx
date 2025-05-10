import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../../components/Header';
import { AuthContext } from '../../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';
import { mockedNavigate } from '../../setupTests';

describe('Header Component', () => {
  afterEach(() => {
    mockedNavigate.mockClear();
  });

  test('renders Login link when no token is present', () => {
    const auth = { token: null };
    render(
      <AuthContext.Provider value={{ auth }}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    // Since the Login button is rendered as a Link, use getByRole('link')
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
  });

  test('renders Logout button when token is present', () => {
    const logoutMock = jest.fn();
    const auth = { token: 'dummy-token' };

    render(
      <AuthContext.Provider value={{ auth, logout: logoutMock }}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    // Expect a button with text "Logout".
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  test('calls logout and navigates to "/" when Logout button is clicked', () => {
    const logoutMock = jest.fn();
    const auth = { token: 'dummy-token' };

    render(
      <AuthContext.Provider value={{ auth, logout: logoutMock }}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(logoutMock).toHaveBeenCalled();
    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });
});
