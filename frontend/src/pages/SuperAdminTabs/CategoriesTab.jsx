import React from 'react';
import { Box, Typography, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import StyledTableCell from '../../context/StyledTableCell';

const CategoriesTab = ({
  categories,
  categoryName,
  setCategoryName,
  addCategory,
  editingCategoryId,
  editCategoryName,
  setEditCategoryName,
  updateCategory,
  deleteCategory,
  setEditingCategoryId
}) => {
  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6">Manage Categories</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField
          label="Category Name"
          variant="outlined"
          value={categoryName}
          onChange={e => setCategoryName(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={addCategory} sx={{ ml: 2 }}>
          Add Category
        </Button>
      </Box>
      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <StyledTableCell>Id</StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map(cat => (
            <TableRow key={cat.id}>
              <TableCell>{cat.id}</TableCell>
              <TableCell>
                {editingCategoryId === cat.id ? (
                  <TextField
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                  />
                ) : (
                  <Button variant="text" onClick={() => {
                    setEditingCategoryId(cat.id);
                    setEditCategoryName(cat.name);
                  }}>
                    {cat.name}
                  </Button>
                )}
              </TableCell>
              <TableCell>
                {editingCategoryId === cat.id ? (
                  <>
                    <Button variant="contained" color="primary" onClick={() => updateCategory(cat.id)} sx={{ mr: 1 }}>
                      Save
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={() => {
                      setEditingCategoryId(null);
                      setEditCategoryName('');
                    }}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button variant="outlined" color="error" onClick={() => deleteCategory(cat.id)}>
                    Delete
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default CategoriesTab;
