const User = require('../models/User');

exports.getProfile = (_req, res) => {
  res.render('profile');
};

exports.getEditProfileView = (req, res) => {
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
