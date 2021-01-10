const Course = require('../models/Course');
const util = require('util');
const LIMIT = 1;

const getMultipleCourseDetail = util.promisify(Course.getMultipleCourseDetail);

exports.getResult = async (req, res) => {
  try {
    const page = req.query.page ? +req.query.page : 0;
    const waitForLength = Course.find({ $text: { $search: req.query.q } });
    const waitForDetailCourse = getMultipleCourseDetail({ $text: { $search: req.query.q } }, page * LIMIT, LIMIT);

    const length = Math.ceil((await waitForLength).length / LIMIT);
    const courses = await waitForDetailCourse;

    const pages = [];

    const start = Math.max(0, page - 2);
    for (let i = start; i < start + 5 && i < length; i++) {
      pages.push(i);
    }

    res.render('student/searchResult', { courses, page, length, pages, query: req.query.q });
  } catch (e) {
    req.flash('error', 'Không thể thực hiện tìm kiếm;');
    res.redirect('/');
  }
};
