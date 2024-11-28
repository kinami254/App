// routes/chat.js

const express = require('express');
const router = express.Router();

// Chat Page
router.get('/chat', (req, res) => {
  res.render('chat', { title: 'Live Chat Support' });
});

module.exports = router;
