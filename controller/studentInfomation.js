const Invoice = require('../models/Invoice');
const moment = require('moment');

exports.getMyCourses = (req, res) => {
  Invoice.find({ user: req.user._id })
    .populate('course')
    .exec((err, invoices) => {
      if (err) {
        req.flash('error', 'Không thể xem danh sách khóa học của bạn');
      } else {
        res.render('student/myCourses', { invoices, moment });
      }
    });
};
