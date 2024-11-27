// app.js

require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const helmet = require('helmet');
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');
const flash = require('connect-flash');
const logger = require('./config/logger'); // Winston logger

const port = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use express-ejs-layouts
app.use(expressLayouts);

// Security Middleware
app.use(helmet());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key', // Replace with a strong secret in production
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // Set to true if using HTTPS
}));

// Initialize flash messages
app.use(flash());

// Initialize CSRF protection
const csrfProtection = csrf();
app.use(csrfProtection);

// Pass CSRF token and flash messages to all views
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Set up EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    // Handle CSRF token errors here
    logger.warn(`CSRF token error: ${err.message}`);
    res.status(403).send('Form tampered with.');
  } else {
    logger.error(`Unhandled Error: ${err.message}`);
    res.status(500).send('Something went wrong!');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
