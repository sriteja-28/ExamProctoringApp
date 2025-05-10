import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import SuperAdminDashboard from '../../pages/SuperAdminDashboard';
import axios from 'axios';

jest.mock('axios');

jest.mock('../../pages/SuperAdminTabs/CategoriesTab', () => () => <div>CategoriesTab</div>);
jest.mock('../../pages/SuperAdminTabs/TestSubmissionsTab', () => () => <div>TestSubmissionsTab</div>);
jest.mock('../../pages/SuperAdminTabs/ManageExamsTab', () => () => <div>ManageExamsTab</div>);
jest.mock('../../pages/SuperAdminTabs/SetQuestionsTab', () => () => <div>SetQuestionsTab</div>);
jest.mock('../../pages/SuperAdminTabs/QuestionCardsTab', () => () => <div>QuestionCardsTab</div>);
jest.mock('../../pages/SuperAdminTabs/BulkUploadQuestionsTab', () => () => <div>BulkUploadQuestionsTab</div>);

describe('SuperAdminDashboard Component', () => {
  const mockCategories = [{ id: 1, name: 'Cat1' }];
  const mockExams = [{ id: 2, name: 'Exam1' }];
  const mockSubmissions = [{ id: 3, score: 90 }];

  beforeEach(() => {
    axios.get.mockImplementation(url => {
      switch (url) {
        case 'http://localhost:5000/api/superadmin/categories':
          return Promise.resolve({ data: mockCategories });
        case 'http://localhost:5000/api/superadmin/exams':
          return Promise.resolve({ data: mockExams });
        case 'http://localhost:5000/api/superadmin/test-submissions':
          return Promise.resolve({ data: mockSubmissions });
        default:
          return Promise.resolve({ data: [] });
      }
    });
    localStorage.setItem('token', 'dummy');
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders loading and then default CategoriesTab', async () => {
    render(<SuperAdminDashboard />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('CategoriesTab')).toBeInTheDocument();
    });

    ['Categories', 'Test Submissions', 'Manage Exams', 'Set Questions', 'Question Cards', 'Bulk Upload']
      .forEach(label => expect(screen.getByRole('tab', { name: label })).toBeInTheDocument());
  });

  test('handles error state', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));
    render(<SuperAdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load categories\. Please try again later\./i)).toBeInTheDocument();
    });
  });

  test('switches tabs and renders corresponding components', async () => {
    render(<SuperAdminDashboard />);
    await waitFor(() => screen.getByText('CategoriesTab'));

    const tabMap = {
      'Test Submissions': 'TestSubmissionsTab',
      'Manage Exams': 'ManageExamsTab',
      'Set Questions': 'SetQuestionsTab',
      'Question Cards': 'QuestionCardsTab',
      'Bulk Upload': 'BulkUploadQuestionsTab'
    };

    for (const [label, placeholder] of Object.entries(tabMap)) {
      fireEvent.click(screen.getByRole('tab', { name: label }));
      await waitFor(() => expect(screen.getByText(placeholder)).toBeInTheDocument());
    }
  });
});
