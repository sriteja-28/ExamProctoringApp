import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CategoriesTab from '../../../pages/SuperAdminTabs/CategoriesTab';

describe('CategoriesTab Component', () => {
  const theme = createTheme();

  const mockSetCategoryName = jest.fn();
  const mockAddCategory = jest.fn();
  const mockSetEditingCategoryId = jest.fn();
  const mockSetEditCategoryName = jest.fn();
  const mockUpdateCategory = jest.fn();
  const mockDeleteCategory = jest.fn();

  const defaultProps = {
    categories: [
      { id: 1, name: 'Cat A' },
      { id: 2, name: 'Cat B' }
    ],
    categoryName: '',
    setCategoryName: mockSetCategoryName,
    addCategory: mockAddCategory,
    editingCategoryId: null,
    editCategoryName: '',
    setEditCategoryName: mockSetEditCategoryName,
    updateCategory: mockUpdateCategory,
    deleteCategory: mockDeleteCategory,
    setEditingCategoryId: mockSetEditingCategoryId
  };

  const renderWithTheme = (props) =>
    render(
      <ThemeProvider theme={theme}>
        <CategoriesTab {...props} />
      </ThemeProvider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders header, input field, and Add Category button', () => {
    renderWithTheme(defaultProps);

    expect(screen.getByText(/Manage Categories/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category Name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Category/i })).toBeInTheDocument();
  });

  test('renders category rows with id, name and Delete button', () => {
    renderWithTheme(defaultProps);

    defaultProps.categories.forEach(cat => {
      expect(screen.getByText(cat.id.toString())).toBeInTheDocument();
      expect(screen.getByRole('button', { name: cat.name })).toBeInTheDocument();
      expect(screen.getAllByRole('button', { name: /Delete/i })).not.toHaveLength(0);
    });
  });

  test('calls setCategoryName on input change', () => {
    renderWithTheme(defaultProps);
    const input = screen.getByLabelText(/Category Name/i);
    fireEvent.change(input, { target: { value: 'New Cat' } });
    expect(mockSetCategoryName).toHaveBeenCalledWith('New Cat');
  });

  test('calls addCategory on Add Category click', () => {
    renderWithTheme(defaultProps);
    const addButton = screen.getByRole('button', { name: /Add Category/i });
    fireEvent.click(addButton);
    expect(mockAddCategory).toHaveBeenCalled();
  });

  test('calls deleteCategory with correct id', () => {
    renderWithTheme(defaultProps);
    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButtons[0]);
    expect(mockDeleteCategory).toHaveBeenCalledWith(1);
  });

  test('clicking name button enables edit mode', () => {
    renderWithTheme(defaultProps);
    const nameButton = screen.getByRole('button', { name: /Cat A/i });
    fireEvent.click(nameButton);
    expect(mockSetEditingCategoryId).toHaveBeenCalledWith(1);
    expect(mockSetEditCategoryName).toHaveBeenCalledWith('Cat A');
  });

  describe('when editing a category', () => {
    const editingProps = {
      ...defaultProps,
      editingCategoryId: 1,
      editCategoryName: 'Cat A'
    };

    test('renders edit input, Save and Cancel buttons', () => {
      renderWithTheme(editingProps);

      expect(screen.getByDisplayValue('Cat A')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    });

    test('calls setEditCategoryName on edit input change', () => {
      renderWithTheme(editingProps);
      const editInput = screen.getByDisplayValue('Cat A');
      fireEvent.change(editInput, { target: { value: 'Updated Cat' } });
      expect(mockSetEditCategoryName).toHaveBeenCalledWith('Updated Cat');
    });

    test('calls updateCategory on Save click', () => {
      renderWithTheme(editingProps);
      const saveButton = screen.getByRole('button', { name: /Save/i });
      fireEvent.click(saveButton);
      expect(mockUpdateCategory).toHaveBeenCalledWith(1);
    });

    test('calls cancel callbacks on Cancel click', () => {
      renderWithTheme(editingProps);
      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      fireEvent.click(cancelButton);
      expect(mockSetEditingCategoryId).toHaveBeenCalledWith(null);
      expect(mockSetEditCategoryName).toHaveBeenCalledWith('');
    });
  });
});
