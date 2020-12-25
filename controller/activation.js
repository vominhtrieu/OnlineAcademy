const ActiveKey = require('../models/ActiveKey');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.activeAccount = (req, res) => {
  ActiveKey.findById(req.params.key, (err, key) => {
    if (err) {
      res.redirect('/');
    } else {
      User.updateOne(
        { _id: new mongoose.Types.ObjectId(key.user) },
        { active: true },
        (err, document) => {
          if (err) {
            res.redirect('/');
          } else {
            ActiveKey.findByIdAndDelete(document._id, (err) => {
              if (err) res.send('Lỗi server');
              else res.send('Đã kích hoạt tài khoản');
            });
          }
        }
      );
    }
  });
};

exports.getNeedActiveView = (req, res) => {
  res.render('student/needActive', { email: req.flash('email') });
};
