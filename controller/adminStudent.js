const User = require('../models/User');

exports.getStudentList = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' });
    res.render('admin/student', { users });
  } catch (e) {
    req.flash('error', 'Không thể lấy danh sách học viên');
    res.redirect('/admin');
  }
};

exports.updateStudent = async (req, res) => {
  try {
    await User.updateOne({ _id: req.params.id }, req.body);
    req.flash('info', 'Đã chỉnh sửa thông học viên này');
  } catch (e) {
    req.flash('error', 'Không thể chỉnh sửa học viên này');
  } finally {
    res.redirect('/admin/students');
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    req.flash('info', 'Đã xóa học sinh này');
  } catch (e) {
    req.flash('error', 'Không thể xóa học sinh này');
  } finally {
    res.redirect('/admin/students');
  }
};

exports.lockStudent = async (req, res) => {
  try {
    await User.updateOne({ _id: req.params.id }, { locked: true });
    req.flash('info', 'Đã khóa tài khoản giảng viên này');
  } catch (e) {
    req.flash('error', 'Không thể khóa tài khoản giảng viên này');
  } finally {
    res.redirect('back');
  }
};

exports.unlockStudent = async (req, res) => {
  try {
    await User.updateOne({ _id: req.params.id }, { locked: false });
    req.flash('info', 'Đã mở khóa tài khoản giảng viên này');
  } catch (e) {
    req.flash('error', 'Không thể mở khóa tài khoản giảng viên này');
  } finally {
    res.redirect('back');
  }
};
