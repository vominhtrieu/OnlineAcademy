const Course = require('../models/Course');

exports.getResult = (req, res) => {
  Course.find({ $text: { $search: req.query.q } }, (err, courses) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Không thể thực hiện tìm kiếm;');
      res.redirect('/');
    } else {
      res.render('student/searchResult', { courses, query: req.query.q });
    }
  });
};
