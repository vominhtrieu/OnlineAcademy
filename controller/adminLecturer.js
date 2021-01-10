const User = require('../models/User');
const nodemailer = require('nodemailer');
const randomString = require('crypto-random-string');
const mailContent = require('../services/mailContent');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.getLecturerList = async (req, res) => {
  try {
    const users = await User.find({ role: 'lecturer' });
    res.render('admin/lecturer', { users });
  } catch (e) {
    req.flash('error', 'Không thể lấy danh sách giảng viên');
    res.redirect('/lecturer');
  }
};

exports.addNewLecturer = async (req, res) => {
  try {
    const password = randomString({ length: 16 });
    const user = await User.register(
      new User({
        email: req.body.email,
        fullName: req.body.fullName,
        active: true,
        role: 'lecturer',
      }),
      password
    );

    const mailOptions = {
      from: `Online Academy <${process.env.EMAIL_ADDRESS}>`,
      to: user.email,
      subject: 'Bạn đã trở thành giảng viên ở Online Academy',
      html: mailContent.getLecturerMailContent(user.fullName, user.email, password),
    };

    await transporter.sendMail(mailOptions);

    req.flash('info', `Tạo tài khoản thành công. Email: ${user.email}, mật khẩu: ${password}`);
  } catch (e) {
    req.flash('error', 'Không thể thêm giảng viên mới');
  }
  res.redirect('back');
};

exports.updateLecturer = async (req, res) => {
  try {
    await User.updateOne({ _id: req.params.id }, req.body);
    req.flash('info', 'Đã chỉnh sửa thông giảng viên này');
  } catch (e) {
    req.flash('error', 'Không thể chỉnh sửa giảng viên này');
  } finally {
    res.redirect('/admin/lecturer');
  }
};

exports.deleteLecturer = async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    req.flash('info', 'Đã xóa giảng viên này');
  } catch (e) {
    req.flash('error', 'Không thể xóa giảng viên này');
  } finally {
    res.redirect('/admin/lecturer');
  }
};
