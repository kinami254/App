// routes/auth.js

const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Registration Route
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      req.flash('error', 'Email already registered.');
      return res.redirect('/register');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });
    req.flash('success', 'Registration successful. Please log in.');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Registration failed. Please try again.');
    res.redirect('/register');
  }
});

// Login Route
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));

// Logout Route
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success', 'You have been logged out.');
    res.redirect('/login');
  });
});

module.exports = router;
