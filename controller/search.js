const Course = require('../models/Course');
const mongoose = require('mongoose');
const util = require('util');
const SubCategory = require('../models/SubCategory');
const LIMIT = 1;

const getMultipleCourseDetail = util.promisify(Course.getMultipleCourseDetail);

exports.getResult = async (req, res) => {
  try {
    const sort = req.query.sort ? req.query.sort : 'rating';
    const page = req.query.page ? +req.query.page : 0;

    let categories;
    let searchCondition = { $text: { $search: req.query.q } };
    if (Array.isArray(req.query.categories)) {
      categories = req.query.categories.map((category) => new mongoose.Types.ObjectId(category));
    } else if (req.query.categories) categories = [new mongoose.Types.ObjectId(req.query.categories)];
    if (req.query.categories) searchCondition.category = { $in: categories };
    const waitForLength = Course.find(searchCondition);
    const waitForDetailCourse = getMultipleCourseDetail(searchCondition, page * LIMIT, LIMIT, sort);

    const tempCourses = await waitForLength;
    const length = Math.ceil(tempCourses.length / LIMIT);
    const courses = await waitForDetailCourse;
    const temp = tempCourses.map((course) => course.category);
    const availabelCategories = await SubCategory.find({ _id: { $in: temp } });

    const pages = [];

    const start = Math.max(0, page - 2);
    for (let i = start; i < start + 5 && i < length; i++) {
      pages.push(i);
    }

    res.render('student/searchResult', { courses, page, length, pages, query: req.query.q, sort, availabelCategories });
  } catch (e) {
    console.log(e);
    req.flash('error', 'Không thể thực hiện tìm kiếm;');
    res.redirect('/');
  }
};
