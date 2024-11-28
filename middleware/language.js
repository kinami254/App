// middleware/language.js

const cookieParser = require('cookie-parser');

module.exports = (req, res, next) => {
  if (req.query.lang) {
    res.setLocale(req.query.lang);
    res.cookie('locale', req.query.lang);
  } else if (req.cookies.locale) {
    res.setLocale(req.cookies.locale);
  }
  next();
};
