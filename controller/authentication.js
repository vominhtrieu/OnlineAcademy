const User = require('../models/User');
const ActiveKey = require('../models/ActiveKey');
const passport = require('passport');
const nodemailer = require('nodemailer');
const mailContent = require('../services/mailContent');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.getSignInView = (req, res) => {
  if (req.user) {
    req.logout();
  }
  res.render('signin', { message: req.flash('info') });
};

exports.getSignUpView = (req, res) => {
  if (req.user) {
    req.logout();
  }
  res.render('signup');
};

exports.signIn = (req, res) => {
  if (!req.user.active) {
    res.redirect('/need-active');
  } else {
    if (req.user.locked) {
      req.flash('error', 'Tài khoản đã bị khóa');
      return res.redirect('/signin');
    }
    res.locals.currentUser = req.user;
    switch (req.user.role) {
      case 'student':
        res.redirect('/');
        break;
      case 'admin':
        res.redirect('/admin');
        break;
      case 'lecturer':
        res.redirect('/lecturer');
    }
  }
};

exports.signUp = (req, res) => {
  User.register(
    new User({
      email: req.body.email,
      fullName: req.body.fullName,
      role: 'student',
    }),
    req.body.password,
    (err, user) => {
      if (err) {
        req.flash('info', 'Email đã tồn tại');
        res.redirect('/signup');
      } else {
        const key = new ActiveKey({ user: user._id });
        key.save().then((document) => {
          const mailOptions = {
            from: `Online Academy <${process.env.EMAIL_ADDRESS}>`,
            to: user.email,
            subject: 'Kích hoạt tài khoản Online Academy',
            html: mailContent.getConfirmMationMailContent(user.fullName, document._id),
          };

          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.log(err);
            }
          });

          passport.authenticate('local', {
            successRedirect: '/need-active',
          })(req, res);
        });
      }
    }
  );
};

exports.signOut = (req, res) => {
  req.logout();
  req.flash('info', 'Successful signed out');
  res.redirect('/signin');
};

exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.query.email });

    if (user !== null) {
      res.json(false);
    } else {
      res.json(true);
    }
  } catch (e) {
    console.log(e);
    res.json(false);
  }
};
