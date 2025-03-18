const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticateToken = require('../middleware/auth');
const permit = require('../middleware/roles');

router.use(authenticateToken);

router.get('/users', permit('ADMIN', 'SUPER_ADMIN'), adminController.getAllUsers);
router.patch('/users/:id/status', permit('ADMIN', 'SUPER_ADMIN'), adminController.updateUserStatus);
router.patch('/users/:id/role', permit('ADMIN', 'SUPER_ADMIN'), adminController.updateUserRole);

module.exports = router;
