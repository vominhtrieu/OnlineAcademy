const Course = require('../models/Course');

exports.getDashboard = (req, res) => {
  Course.find({})
    .populate('category')
    .exec((err, courses) => {
      if (err) console.log(err);
      else res.render('lecturer/dashboard', { courses });
    });
};
