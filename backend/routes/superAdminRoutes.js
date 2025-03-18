const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const permit = require('../middleware/roles');

const categoryController = require('../controllers/superAdmin/categoryController');
const questionController = require('../controllers/superAdmin/questionController');
const submissionController = require('../controllers/superAdmin/submissionController');


const {
    getAllExams,   
    createExam,      
    updateExam,       
    deleteExam,       
    getExamAttempts,  
    getUserExamAttempts 
} = require('../controllers/superAdmin/examController'); 

//! All routes require authentication and SUPER_ADMIN role.
router.use(authenticateToken);
router.use(permit('SUPER_ADMIN'));

//! Category routes.
router.post('/categories', categoryController.createCategory);
router.put('/categories/:id', categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);
router.get('/categories', categoryController.listCategories);

//! Question routes.
router.post('/questions', questionController.createQuestion);
router.get('/questions/:categoryId', questionController.listQuestionsByCategory);
router.put('/questions/:id', questionController.updateQuestion);    
router.delete('/questions/:id', questionController.deleteQuestion);

//! Bulk questions upload endpoint.
router.post('/questions/bulk', questionController.bulkCreateQuestions);



//! Exam routes.
router.get('/exams', getAllExams);
router.post('/exams', createExam);
router.put('/exams/:id', updateExam);
router.delete('/exams/:id', deleteExam);

//! Exam attempts and submissions.
router.get('/exam-attempts', getExamAttempts);
router.get('/exam-attempts/:userId', getUserExamAttempts);
router.get('/test-submissions', submissionController.getTestSubmissions);

module.exports = router;
