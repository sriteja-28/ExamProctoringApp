import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Table, TableHead, TableRow, TableCell, TableBody, Button, TextField } from '@mui/material';
import axios from 'axios';

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

  const toggleUserStatus = (id, currentStatus) => {
    axios.patch(`http://localhost:5000/api/admin/users/${id}/status`, { isActive: !currentStatus }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(() => {
      setUsers(users.map(user => (user.id === id ? { ...user, isActive: !currentStatus } : user)));
    });
  };

  const updateUserRole = (id) => {
    const role = roleUpdates[id];
    axios.patch(`http://localhost:5000/api/admin/users/${id}/role`, { role }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(() => {
      setUsers(users.map(user => (user.id === id ? { ...user, role } : user)));
    });
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Update Role</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.isActive ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>
                  <TextField label="Role" variant="outlined" size="small" value={roleUpdates[user.id] || ''} onChange={e => setRoleUpdates({ ...roleUpdates, [user.id]: e.target.value })} placeholder="SUPER_ADMIN or USER" />
                  <Button onClick={() => updateUserRole(user.id)} sx={{ ml: 1 }}>Update</Button>
                </TableCell>
                <TableCell>
                  <Button onClick={() => toggleUserStatus(user.id, user.isActive)}>
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
