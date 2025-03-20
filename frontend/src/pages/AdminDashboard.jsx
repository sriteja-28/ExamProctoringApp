import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import axios from 'axios';
import StyledTableCell from '../context/StyledTableCell';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [roleUpdates, setRoleUpdates] = useState({});

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/users', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  const toggleUserStatus = (id, currentStatus, role) => {
    if (role === 'ADMIN') return; // Prevent toggling admin status.
    axios.patch(`http://localhost:5000/api/admin/users/${id}/status`, { isActive: !currentStatus }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(() => {
        setUsers(users.map(user =>
          user.id === id ? { ...user, isActive: !currentStatus } : user
        ));
      })
      .catch(err => console.error(err));
  };

  const updateUserRole = (id, currentRole) => {
    if (currentRole === 'ADMIN') return; // Prevent updating role if user is admin.
    const newRole = roleUpdates[id];
    axios.patch(`http://localhost:5000/api/admin/users/${id}/role`, { role: newRole }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(() => {
        // Update the user's role in the state.
        setUsers(users.map(user =>
          user.id === id ? { ...user, role: newRole } : user
        ));
        // Clear the dropdown selection for this user.
        setRoleUpdates(prev => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      })
      .catch(err => console.error(err));
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Table>
          <TableHead>
             <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Role</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Update Role</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => {
              const isUserAdmin = user.role === 'ADMIN';
              return (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.isActive ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>
                    <FormControl size="small" variant="outlined" sx={{ minWidth: 150 }} disabled={isUserAdmin}>
                      <InputLabel>Role</InputLabel>
                      <Select
                        value={roleUpdates[user.id] || ''}
                        onChange={e => setRoleUpdates({ ...roleUpdates, [user.id]: e.target.value })}
                        label="Role"
                      >
                        <MenuItem value="SUPER_ADMIN">SUPER_ADMIN</MenuItem>
                        <MenuItem value="USER">USER</MenuItem>
                      </Select>
                    </FormControl>
                    <Button onClick={() => updateUserRole(user.id, user.role)} disabled={isUserAdmin} sx={{ ml: 1 }}>
                      Update
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => toggleUserStatus(user.id, user.isActive, user.role)} disabled={isUserAdmin}>
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
