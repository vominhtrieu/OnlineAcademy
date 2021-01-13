const Course = require('../models/Course');
const Invoice = require('../models/Invoice');
const User = require('../models/User');

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate({ path: 'favoriteCourses', populate: { path: 'lecturer reviews' } })
    .exec();
  const favoriteCourses = user.favoriteCourses;
  const invoices = await Invoice.find({ user: req.user._id })
    .populate({ path: 'course', populate: { path: 'lecturer reviews' } })
    .exec();
  const userCourses = invoices.map(({ course }) => course);

  userCourses.forEach((course) => {
    if (course.reviews.length === 0) return;
    let sum = 0;
    course.reviews.forEach((review) => (sum += review.score));
    course.rating = sum / course.reviews.length;
  });

  favoriteCourses.forEach((course) => {
    if (course.reviews.length === 0) return;
    let sum = 0;
    course.reviews.forEach((review) => (sum += review.score));
    course.rating = sum / course.reviews.length;
  });

  res.render('profile', { favoriteCourses, userCourses });
};

exports.getEditProfileView = (_req, res) => {
  res.render('editProfile');
};

exports.updateProfile = async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.user._id },
      {
        fullName: req.body.fullName,
        email: req.body.email,
      }
    );
    req.flash('info', 'Cập nhật thông tin thành công');
  } catch (err) {
    req.flash('error', 'Không thể cập nhật thông tin');
  } finally {
    res.redirect('back');
  }
};

exports.changePassword = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user._id });
    await user.changePassword(req.body.oldPassword, req.body.newPassword);
    req.flash('info', 'Đổ mật khẩu thành công');
  } catch (err) {
    req.flash('error', 'Thông tin đã nhập không hợp lệ');
  } finally {
    res.redirect('back');
  }
};

exports.addCourseToFavoriteList = async (req, res) => {
  try {
    const course = await Course.findById(req.body.courseId);
    if (!course) req.flash('error', 'Không tìm thấy khóa học');
    else {
      await User.updateOne({ _id: req.user._id }, { $addToSet: { favoriteCourses: course._id } });
      req.flash('info', 'Đã thêm vào danh sách yêu thích');
    }
  } catch (e) {
    req.flash('error', 'Xảy ra lỗi khi thêm vào danh sách yêu thích');
  } finally {
    res.redirect('back');
  }
};

exports.removeCourseFromFavoriteList = async (req, res) => {
  try {
    await User.updateOne({ _id: req.user._id }, { $pull: { favoriteCourses: req.body.courseId } });
    req.flash('info', 'Đã xóa khỏi danh sách yêu thích');
    res.redirect('back');
  } catch (e) {
    req.flash('error', 'Không thể xóa khỏi danh sách yêu thích');
    res.redirect('back');
  }
};
