// controllers/homeController.js

exports.getHomePage = (req, res) => {
  res.render('home', { title: 'Home' });
};
