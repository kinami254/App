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
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const logger = require('./config/logger'); // Winston logger

const { sequelize, User, Service, Booking, Testimonial, GalleryImage, Contact } = require('./models'); // Correct import

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

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Initialize flash messages
app.use(flash());

// Configure Passport Local Strategy
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Initialize CSRF protection
const csrfProtection = csrf();
app.use(csrfProtection);

// Pass variables to all views
app.use((req, res, next) => {
  res.locals.baseUrl = process.env.BASE_URL || `http://${req.headers.host}`;
  res.locals.csrfToken = req.csrfToken();
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null; // Make user available in all views
  res.locals.currentUrl = req.originalUrl; // Add currentUrl
  next();
});

// Set up EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const bookingRouter = require('./routes/booking');
const testimonialsRouter = require('./routes/testimonials');
const chatRouter = require('./routes/chat');
const sitemapRouter = require('./routes/sitemap');

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/', bookingRouter);
app.use('/testimonials', testimonialsRouter);
app.use('/', chatRouter);
app.use('/', sitemapRouter);

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

// Sync all models
sequelize.sync()
  .then(() => {
    console.log('All models were synchronized successfully.');
    logger.info('All models were synchronized successfully.');
  })
  .catch(err => {
    console.error('Error synchronizing models:', err);
    logger.error(`Error synchronizing models: ${err.message}`);
  });

// Socket.io for Real-Time Chat
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', (msg) => {
    // Broadcast the message to all clients
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
