const Course = require('../models/Course');
const util = require('util');

const getFeatureCourses = util.promisify(Course.getFeatureCourses);
const getMostViewCourses = util.promisify(Course.getMostViewCourses);
const getNewCourses = util.promisify(Course.getNewCourses);

exports.getHomeView = async (req, res) => {
  if (req.user && req.user.role === 'admin') {
    res.redirect('/admin');
  } else if (req.user && req.user.role === 'lecturer') {
    res.redirect('/lecturer');
  } else {
    try {
      const featureCourses = await getFeatureCourses(4);
      const newCourses = await getNewCourses(10);
      const mostViewCourses = await getMostViewCourses(10);
      res.render('student/home', { featureCourses, newCourses, mostViewCourses });
    } catch (e) {
      console.log(e);
      req.flash('error', 'Không thể lấy danh sách khóa học');
      res.render('student/home', { featureCourses: [], newCourses: [], mostViewCourses: [] });
    }
  }
};
