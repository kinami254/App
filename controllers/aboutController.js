 // controllers/aboutController.js

exports.getAboutPage = (req, res) => {
    res.render('about', {
      title: 'About Us',
      // You can pass additional data here if needed
    });
  };
  
