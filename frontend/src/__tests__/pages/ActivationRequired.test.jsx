import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ActivationRequired from '../../pages/ActivationRequired';
import { useNavigate } from 'react-router-dom';


jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('ActivationRequired Component', () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

   
    window.open = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders header, message, and buttons', () => {
    render(<ActivationRequired />);

    expect(screen.getByText(/Account Not Active/i)).toBeInTheDocument();
    expect(screen.getByText(/Your account is not active\. Please contact support for activation\./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Contact Support/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Return to Login/i })).toBeInTheDocument();
  });

  test('clicking Contact Support opens mail client', () => {
    render(<ActivationRequired />);

    const contactButton = screen.getByRole('button', { name: /Contact Support/i });
    fireEvent.click(contactButton);

    expect(window.open).toHaveBeenCalledWith(
      'mailto:support@example.com?subject=Account Activation',
      '_blank'
    );
  });

  test('clicking Return to Login navigates to root', () => {
    render(<ActivationRequired />);

    const returnButton = screen.getByRole('button', { name: /Return to Login/i });
    fireEvent.click(returnButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
