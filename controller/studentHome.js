const Course = require('../models/Course');

exports.getHomeView = (req, res) => {
  if (req.user && req.user.role === 'admin') {
    res.redirect('/admin');
  } else if (req.user && req.user.role === 'lecturer') {
    res.redirect('/lecturer');
  } else {
    Course.getFeatureCourses(10, (err, featureCourses) => {
      if (err) {
        req.flash('error', 'Không thể lấy danh sách khóa học nổi bật nhất');
        featureCourses = [];
      }
      Course.getMostViewCourses(10, (err, mostViewCourses) => {
        if (err) {
          req.flash('error', 'Không thể lấy danh sách khóa học được xem nhiều nhất');
          mostViewCourses = [];
        }
        res.render('student/home', { featureCourses, mostViewCourses });
      });
    });
  }
};
