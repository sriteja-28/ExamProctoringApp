import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  TableSortLabel, 
  TextField 
} from '@mui/material';

const headCells = [
  { id: 'id', label: 'ID' },
  { id: 'email', label: 'User Email' },
  { id: 'exam', label: 'Exam' },
  { id: 'score', label: 'Score' },
  { id: 'createdAt', label: 'Date' },
];


function getValue(submission, key) {
  switch (key) {
    case 'email':
      return submission.User?.email || '';
    case 'exam':
      return submission.Exam?.name || '';
    case 'createdAt':
      return submission.createdAt ? new Date(submission.createdAt).getTime() : 0;
    default:
      return submission[key];
  }
}


function descendingComparator(a, b, orderBy) {
  const aValue = getValue(a, orderBy);
  const bValue = getValue(b, orderBy);
  if (bValue < aValue) return -1;
  if (bValue > aValue) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedArray = array.map((el, index) => [el, index]);
  stabilizedArray.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedArray.map((el) => el[0]);
}

const TestSubmissionsTab = ({ submissions }) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [searchTerm, setSearchTerm] = useState('');

  if (!submissions || submissions.length === 0) {
    return (
      <Box sx={{ my: 2 }}>
        <Typography variant="h6">Test Submissions</Typography>
        <Typography variant="body1">No test submissions found.</Typography>
      </Box>
    );
  }


  const filteredSubmissions = useMemo(() => {
    if (!searchTerm) return submissions;
    return submissions.filter(sub =>
      sub.Exam?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [submissions, searchTerm]);

  
  const sortedSubmissions = useMemo(() => {
    return stableSort(filteredSubmissions, getComparator(order, orderBy));
  }, [filteredSubmissions, order, orderBy]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6">Test Submissions</Typography>
      <Box sx={{ my: 2 }}>
        <TextField
          label="Search by Exam Name"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />
      </Box>
      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            {headCells.map((headCell) => (
              <TableCell key={headCell.id}>
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={() => handleRequestSort(headCell.id)}
                >
                  {headCell.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedSubmissions.map(sub => (
            <TableRow key={sub.id}>
              <TableCell>{sub.id}</TableCell>
              <TableCell>{sub.User?.email || 'N/A'}</TableCell>
              <TableCell>{sub.Exam?.name || 'N/A'}</TableCell>
              <TableCell>{sub.score}</TableCell>
              <TableCell>
                {sub.createdAt ? new Date(sub.createdAt).toLocaleString() : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default TestSubmissionsTab;
