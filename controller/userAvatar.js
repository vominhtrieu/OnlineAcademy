const User = require('../models/User');

exports.updateAvatar = async (req, res) => {
  if (req.file) {
    await User.updateOne({ _id: req.user._id }, { avatar: req.file.filename });
    req.flash('info', 'Đã cập nhật avatar');
  } else {
    req.flash('error', 'Không thể cập nhật avatar');
  }
  res.redirect('back');
};
