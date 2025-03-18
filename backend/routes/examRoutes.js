const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const permit = require('../middleware/roles');

const superAdminExamController = require('../controllers/superAdmin/examController');
const examController = require('../controllers/examController');

router.use(authenticateToken);

//! Superadmin Endpoints
router.get('/superadmin/exams', permit('SUPER_ADMIN'), superAdminExamController.getAllExams);
router.post('/superadmin/exams', permit('SUPER_ADMIN'), superAdminExamController.createExam);
router.put('/superadmin/exams/:id', permit('SUPER_ADMIN'), superAdminExamController.updateExam);
router.delete('/superadmin/exams/:id', permit('SUPER_ADMIN'), superAdminExamController.deleteExam);
router.get('/superadmin/exam-attempts', permit('SUPER_ADMIN'), superAdminExamController.getExamAttempts);
router.get('/superadmin/exam-attempts/:userId', permit('SUPER_ADMIN'), superAdminExamController.getUserExamAttempts);

//! User Endpoints
router.get('/', examController.getExams);
router.get('/:id', examController.getExamById);
router.post('/:id/start', examController.startExam);
router.post('/:id/submit', examController.submitExam);
router.post('/:id/cancel', examController.cancelExam);
router.get('/attempts/:userId', examController.getUserAttempts);

module.exports = router;
