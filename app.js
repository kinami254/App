// app.js

require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/db');
const port = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use express-ejs-layouts
app.use(expressLayouts);

// Set up EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// Start the server
app.listen(3000, '0.0.0.0', () => console.log('Server running on port 3000'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
