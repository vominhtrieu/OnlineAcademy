const Course = require('../models/Course');

exports.getCourseList = async (req, res) => {
  try {
    const courses = await Course.find({}).populate('lecturer').exec();
    res.render('admin/courses', { courses });
  } catch (e) {
    req.flash('error', 'Không thể lấy danh sách khóa học');
    res.redirect('back');
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    await Course.deleteOne({ _id: req.params.id });
    req.flash('info', 'Đã xóa khóa học thành công');
  } catch (e) {
    req.flash('error', 'Không thể xóa khóa học này');
  }
  res.redirect('back');
};
