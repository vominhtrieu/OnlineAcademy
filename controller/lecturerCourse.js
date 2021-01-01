const mongoose = require('mongoose');
const Course = require('../models/Course');
const SubCategory = require('../models/SubCategory');

exports.getAddNewCourseView = (_req, res) => {
  res.render('lecturer/newCourse');
};

exports.addNewCourse = (req, res) => {
  SubCategory.findById(new mongoose.Types.ObjectId(req.body.category), (err, category) => {
    if (err || !category) {
      req.flash('error', 'Không thể thêm khóa học này');
      res.redirect('/lecturer');
    } else {
      Course.create(
        {
          name: req.body.name,
          avatar: req.file.filename,
          category: category._id,
          view: 0,
          description: req.body.description,
          price: req.body.price,
          lecturer: req.user._id,
        },
        (err) => {
          if (err) {
            req.flash('error', 'Không thể thêm khóa học này');
          } else {
            req.flash('info', 'Đã thêm khóa học thành công');
          }
          res.redirect('/lecturer');
        }
      );
    }
  });
};
