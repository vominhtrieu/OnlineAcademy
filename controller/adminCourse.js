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

exports.disableCourse = async (req, res) => {
  try {
    await Course.updateOne({ _id: req.params.id }, { disabled: true });
    req.flash('info', 'Đã đình chỉ khóa học thành công');
  } catch (e) {
    req.flash('error', 'Không thể đình chỉ khóa học này');
  }
  res.redirect('back');
};

exports.enableCourse = async (req, res) => {
  try {
    await Course.updateOne({ _id: req.params.id }, { disabled: false });
    req.flash('info', 'Đã mở lại khóa học thành công');
  } catch (e) {
    req.flash('error', 'Không thể mở lại khóa học này');
  }
  res.redirect('back');
};
