import React from 'react';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminDashboard from '../../pages/AdminDashboard';
import axios from 'axios';


jest.mock('axios');


beforeEach(() => {
  localStorage.setItem('token', 'dummy-token');
});
afterEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

const fakeUsers = [
  {
    id: 1,
    email: 'user1@example.com',
    role: 'USER',
    isActive: true,
  },
  {
    id: 2,
    email: 'admin@example.com',
    role: 'ADMIN',
    isActive: true,
  }
];

describe('AdminDashboard Component', () => {
  test('renders table with users', async () => {
    axios.get.mockResolvedValue({ data: fakeUsers });
    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText(/user1@example.com/i)).toBeInTheDocument();
      expect(screen.getByText(/admin@example.com/i)).toBeInTheDocument();
    });
    expect(screen.getByText('USER')).toBeInTheDocument();
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
    expect(screen.getAllByText('Active').length).toBeGreaterThan(0);
  });

  test('calls toggleUserStatus when clicking the Activate/Deactivate button for non-admin user', async () => {
    axios.get.mockResolvedValue({ data: fakeUsers });
    axios.patch.mockResolvedValue({});
    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText(/user1@example.com/i)).toBeInTheDocument();
    });
    const userRow = screen.getByText(/user1@example.com/i).closest('tr');
    const toggleButton = within(userRow).getByRole('button', { name: /deactivate/i });
    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(axios.patch).toHaveBeenCalledWith(
        'http://localhost:5000/api/admin/users/1/status',
        { isActive: false },
        { headers: { Authorization: `Bearer dummy-token` } }
      );
    });
  });

  test('calls updateUserRole when clicking the update button for a non-admin user', async () => {
    axios.get.mockResolvedValue({ data: fakeUsers });
    axios.patch.mockResolvedValue({});
    render(<AdminDashboard />);
    
   
    await waitFor(() => {
      expect(screen.getByText(/user1@example.com/i)).toBeInTheDocument();
    });
    
  
    const userRow = screen.getByText(/user1@example.com/i).closest('tr');
    const selectContainer = within(userRow).getByTestId('role-select-1');
    
   
    const nativeInput = selectContainer.querySelector('input');
    
    fireEvent.change(nativeInput, { target: { value: 'SUPER_ADMIN' } });
    
    const updateButton = within(userRow).getByRole('button', { name: /update/i });
    fireEvent.click(updateButton);
    
    await waitFor(() => {
      expect(axios.patch).toHaveBeenCalledWith(
        'http://localhost:5000/api/admin/users/1/role',
        { role: 'SUPER_ADMIN' },
        { headers: { Authorization: `Bearer dummy-token` } }
      );
    });
  });
  
  
  test('disables status toggle and role update for admin user', async () => {
    axios.get.mockResolvedValue({ data: fakeUsers });
    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText(/admin@example.com/i)).toBeInTheDocument();
    });
    const adminRow = screen.getByText(/admin@example.com/i).closest('tr');
    const updateButton = within(adminRow).getByRole('button', { name: /update/i });
    const toggleButton = within(adminRow).getByRole('button', { name: /deactivate/i });
    expect(updateButton).toBeDisabled();
    expect(toggleButton).toBeDisabled();
  });
});
