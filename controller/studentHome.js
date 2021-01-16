const SubCategory = require('../models/SubCategory');
const Course = require('../models/Course');
const util = require('util');

const getMostEnrolledCategories = util.promisify(SubCategory.getMostEnrolledCategories);
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
      const mostEnrolledCategories = await getMostEnrolledCategories(5);
      const featureCourses = await getFeatureCourses(3);
      const newCourses = await getNewCourses(10);
      const mostViewCourses = await getMostViewCourses(10);
      res.render('student/home', { mostEnrolledCategories, featureCourses, newCourses, mostViewCourses });
    } catch (e) {
      console.log(e);
      req.flash('error', 'Không thể lấy danh sách khóa học');
      res.render('student/home', { featureCourses: [], newCourses: [], mostViewCourses: [] });
    }
  }
};
