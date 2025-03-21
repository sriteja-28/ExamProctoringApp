const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    if (!req.user.isActive) {
      return res.redirect('http://localhost:5173/activation-required');
    }
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, role: req.user.role, isActive: req.user.isActive },
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    );

    res.redirect(`http://localhost:5173/?token=${token}`);
  }
);


module.exports = router;
