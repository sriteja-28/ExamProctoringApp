const express = require('express');
const router = express.Router();
const {getSubmissions } = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');


router.use(authenticateToken);


router.get('/submissions', getSubmissions);

module.exports = router;
