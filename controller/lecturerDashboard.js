const Course = require('../models/Course');

exports.getDashboard = (req, res) => {
  Course.find({ lecturer: req.user._id })
    .populate('category reviews')
    .exec((err, courses) => {
      if (err) console.log(err);
      else {
        courses.forEach((course) => {
          if (course.reviews.length > 0) {
            let rating = 0;
            course.reviews.forEach((review) => (rating = review.score));
            course.rating = rating / course.reviews.length;
          }
        });
        res.render('lecturer/dashboard', { courses });
      }
    });
};
