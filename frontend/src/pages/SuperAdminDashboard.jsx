import React, { useEffect, useState ,useCallback } from 'react';
import { Container, Typography, Box, Tabs, Tab ,CircularProgress, Alert} from '@mui/material';
import axios from 'axios';

import CategoriesTab from './SuperAdminTabs/CategoriesTab';
import TestSubmissionsTab from './SuperAdminTabs/TestSubmissionsTab';
import ManageExamsTab from './SuperAdminTabs/ManageExamsTab';
import SetQuestionsTab from './SuperAdminTabs/SetQuestionsTab';
import QuestionCardsTab from './SuperAdminTabs/QuestionCardsTab';
import BulkUploadQuestionsTab from './SuperAdminTabs/BulkUploadQuestionsTab';


const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);

  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  const [exams, setExams] = useState([]);
  const [examName, setExamName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [examDuration, setExamDuration] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examNumberOfSets, setExamNumberOfSets] = useState('');
  const [examQuestionsPerSet, setExamQuestionsPerSet] = useState('');

  const [selectedQuestionCategory, setSelectedQuestionCategory] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctOption, setCorrectOption] = useState('');

  const [submissions, setSubmissions] = useState([]);

  const [selectedQuestionCategoryForCards, setSelectedQuestionCategoryForCards] = useState('');
  const [cardQuestions, setCardQuestions] = useState([]);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editingQuestionData, setEditingQuestionData] = useState({
    text: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOption: ''
  });

  const [selectedBulkCategory, setSelectedBulkCategory] = useState('');
  const [categoryQuestionCount, setCategoryQuestionCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:5000/api/superadmin/categories', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories. Please try again later.');

    }
    finally {
      setLoading(false);
    }
  };

  const fetchExams = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:5000/api/superadmin/exams', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setExams(res.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setExams([]);
      } else {
        console.error('Error fetching exams:', error);
        setError('Failed to load exams. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:5000/api/superadmin/test-submissions', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSubmissions(res.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setSubmissions([]);
      } else {
        console.error('Error fetching test submissions:', error);
        setError('Failed to load test submissions. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (categoryId) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`http://localhost:5000/api/superadmin/questions/${categoryId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setQuestions(res.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to load questions.');
    }
    finally {
      setLoading(false);
    }
  };

  const fetchCardQuestions = async (categoryId) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`http://localhost:5000/api/superadmin/questions/${categoryId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCardQuestions(res.data);
      setCategoryQuestionCount(res.data.length);
    } catch (error) {
      console.error('Error fetching card questions:', error);
      setError('Failed to load card questions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchExams();
    fetchSubmissions();
  }, []);

  useEffect(() => {
    if (activeTab === 3 && selectedQuestionCategory) {
      fetchQuestions(selectedQuestionCategory);
    }
  }, [activeTab, selectedQuestionCategory,fetchQuestions]);

  useEffect(() => {
    if (activeTab === 4 && selectedQuestionCategoryForCards) {
      fetchCardQuestions(selectedQuestionCategoryForCards);
    }
  }, [activeTab, selectedQuestionCategoryForCards, fetchCardQuestions]);

  const addCategory = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/superadmin/categories', { name: categoryName }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCategoryName('');
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      setError('Failed to add category.');
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id) => {
    setLoading(true);
    setError('');
    try {
      await axios.put(`http://localhost:5000/api/superadmin/categories/${id}`, { name: editCategoryName }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEditingCategoryId(null);
      setEditCategoryName('');
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      setError('Failed to update category.');
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    setLoading(true);
    setError('');
    try {
      await axios.delete(`http://localhost:5000/api/superadmin/categories/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category.');
    } finally {
      setLoading(false);
    }
  };

  const scheduleExam = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/superadmin/exams', {
        name: examName,
        categoryId: selectedCategory,
        duration: examDuration,
        date: examDate,
        numberOfSets: examNumberOfSets,
        questionsPerSet: examQuestionsPerSet
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setExamName('');
      setExamDuration('');
      setExamDate('');
      setExamNumberOfSets('');
      setExamQuestionsPerSet('');
      fetchExams();
    } catch (error) {
      console.error('Error scheduling exam:', error);
      setError('Failed to schedule exam.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/superadmin/questions', {
        text: questionText,
        optionA,
        optionB,
        optionC,
        optionD,
        correctOption,
        categoryId: selectedQuestionCategory
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setQuestionText('');
      setOptionA('');
      setOptionB('');
      setOptionC('');
      setOptionD('');
      setCorrectOption('');
      fetchQuestions(selectedQuestionCategory);
    } catch (error) {
      console.error('Error adding question:', error);
      setError('Failed to add question.');
    } finally {
      setLoading(false);
    }
  };

  const startEditingQuestion = useCallback((question) => {
    setEditingQuestionId(question.id);
    setEditingQuestionData({
      text: question.text,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      correctOption: question.correctOption,
    });
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingQuestionId(null);
    setEditingQuestionData({
      text: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctOption: ''
    });
  }, []);

  const updateQuestion = async (questionId) => {
    setLoading(true);
    setError('');
    try {
      await axios.put(`http://localhost:5000/api/superadmin/questions/${questionId}`, editingQuestionData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchCardQuestions(selectedQuestionCategoryForCards);
      cancelEditing();
    } catch (error) {
      console.error('Error updating question:', error);
      setError('Failed to update question.');
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (questionId) => {
    setLoading(true);
    setError('');
    try {
      await axios.delete(`http://localhost:5000/api/superadmin/questions/${questionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchCardQuestions(selectedQuestionCategoryForCards);
    } catch (error) {
      console.error('Error deleting question:', error);
      setError('Failed to delete question.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4">Super Admin Dashboard</Typography>
        {loading && <CircularProgress sx={{ mt: 2 }} />}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            backgroundColor: "#f5f5f5",
            color: "red",
            "& .MuiTabs-indicator": {
              backgroundColor: "darkcyan",
            },
          }}
        >
          <Tab label="Categories" sx={{
            color: activeTab === 0 ? "#C71585" : "#0B5A72",
            "&.Mui-selected": { color: "#ef3317" },
            fontWeight: "bold",
            fontSize: "1rem",
          }} />
          <Tab label="Test Submissions" sx={{
            color: activeTab === 1 ? "#C71585" : "#0B5A72",
            "&.Mui-selected": { color: "#ef3317" },
            fontWeight: "bold",
            fontSize: "1rem",
          }} />
          <Tab label="Manage Exams" sx={{
            color: activeTab === 2 ? "#C71585" : "#0B5A72",
            "&.Mui-selected": { color: "#ef3317" },
            fontWeight: "bold",
            fontSize: "1rem",
          }} />
          <Tab label="Set Questions" sx={{
            color: activeTab === 3 ? "#C71585" : "#0B5A72",
            "&.Mui-selected": { color: "#ef3317" },
            fontWeight: "bold",
            fontSize: "1rem",
          }} />
          <Tab label="Question Cards" sx={{
            color: activeTab === 4 ? "#C71585" : "#0B5A72",
            "&.Mui-selected": { color: "#ef3317" },
            fontWeight: "bold",
            fontSize: "1rem",
          }} />
          <Tab label="Bulk Upload" sx={{
            color: activeTab === 5 ? "#C71585" : "#0B5A72",
            "&.Mui-selected": { color: "#ef3317" },
            fontWeight: "bold",
            fontSize: "1rem",
          }} />
        </Tabs>

        {activeTab === 0 && (
          <CategoriesTab
            categories={categories}
            categoryName={categoryName}
            setCategoryName={setCategoryName}
            addCategory={addCategory}
            editingCategoryId={editingCategoryId}
            editCategoryName={editCategoryName}
            setEditCategoryName={setEditCategoryName}
            updateCategory={updateCategory}
            deleteCategory={deleteCategory}
            setEditingCategoryId={setEditingCategoryId}
          />
        )}

        {activeTab === 1 && (
          <TestSubmissionsTab submissions={submissions} />
        )}

        {activeTab === 2 && (
          <ManageExamsTab
            exams={exams}
            examName={examName}
            setExamName={setExamName}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            examDuration={examDuration}
            setExamDuration={setExamDuration}
            examDate={examDate}
            setExamDate={setExamDate}
            scheduleExam={scheduleExam}
            categories={categories}
            examNumberOfSets={examNumberOfSets}
            setExamNumberOfSets={setExamNumberOfSets}
            examQuestionsPerSet={examQuestionsPerSet}
            setExamQuestionsPerSet={setExamQuestionsPerSet}
            refreshExams={fetchExams}
            totalQuestions={
            categories.find(cat => cat.id === selectedCategory)?.totalQuestions || categoryQuestionCount
          }
          />
        )}

        {activeTab === 3 && (
          <SetQuestionsTab
            categories={categories}
            selectedQuestionCategory={selectedQuestionCategory}
            setSelectedQuestionCategory={setSelectedQuestionCategory}
            questionText={questionText}
            setQuestionText={setQuestionText}
            optionA={optionA}
            setOptionA={setOptionA}
            optionB={optionB}
            setOptionB={setOptionB}
            optionC={optionC}
            setOptionC={setOptionC}
            optionD={optionD}
            setOptionD={setOptionD}
            correctOption={correctOption}
            setCorrectOption={setCorrectOption}
            addQuestion={addQuestion}
            questions={questions}
          />
        )}

        {activeTab === 4 && (
          <QuestionCardsTab
            categories={categories}
            selectedQuestionCategoryForCards={selectedQuestionCategoryForCards}
            setSelectedQuestionCategoryForCards={setSelectedQuestionCategoryForCards}
            cardQuestions={cardQuestions}
            editingQuestionId={editingQuestionId}
            editingQuestionData={editingQuestionData}
            setEditingQuestionData={setEditingQuestionData}
            startEditingQuestion={startEditingQuestion}
            cancelEditing={cancelEditing}
            updateQuestion={updateQuestion}
            deleteQuestion={deleteQuestion}
            setCardQuestions={setCardQuestions}
            questionCount={categoryQuestionCount}
          />
        )}

        {activeTab === 5 && (
          <BulkUploadQuestionsTab
            selectedCategory={selectedBulkCategory}
            setSelectedCategory={setSelectedBulkCategory}
            categories={categories} />
        )}
      </Box>
    </Container>
  );
};

export default SuperAdminDashboard;
