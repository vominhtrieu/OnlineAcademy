const Course = require('../models/Course');
const SubCategory = require('../models/SubCategory');
const util = require('util');
const mongoose = require('mongoose');
const LIMIT = 5;

const getMultipleCourseDetail = util.promisify(Course.getMultipleCourseDetail);

exports.getCoursesInCategory = async (req, res) => {
  try {
    const page = req.query.page ? +req.query.page : 0;
    const category = await SubCategory.findById(req.params.id);
    const waitForLength = Course.find({ category: req.params.id, disabled: false });
    const waitForDetailCourse = getMultipleCourseDetail(
      { category: new mongoose.Types.ObjectId(req.params.id), disabled: false },
      page * LIMIT,
      LIMIT,
      'rating'
    );

    const length = Math.ceil((await waitForLength).length / LIMIT);
    const courses = await waitForDetailCourse;

    const pages = [];

    const start = Math.max(0, page - 2);
    for (let i = start; i < start + 5 && i < length; i++) {
      pages.push(i);
    }

    res.render('categories', { category, courses, page, length, pages });
  } catch (e) {
    console.log(e);
    req.flash('error', 'Không thể lấy danh sách khóa học trong lĩnh vực này');
    res.redirect('back');
  }
};
