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
  res.render('signin', { message: req.flash('info') });
};

exports.getSignUpView = (req, res) => {
  res.render('signup');
};

exports.signIn = (req, res) => {
  if (!req.user.active) {
    res.redirect('/need-active');
  } else {
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
  if (req.body.role !== 'student' && req.body.role !== 'lecturer') {
    req.flash('error', 'Không chấp nhận tài khoản với role này');
    res.redirect('/signup');
  } else {
    User.register(
      new User({
        email: req.body.email,
        fullName: req.body.fullName,
        role: req.body.role,
      }),
      req.body.password,
      (err, user) => {
        if (err) {
          console.log(err);
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

            req.flash('email', user.email);

            passport.authenticate('local', {
              successRedirect: '/need-active',
            })(req, res);
          });
        }
      }
    );
  }
};

exports.signOut = (req, res) => {
  req.logout();
  req.flash('info', 'Successful signed out');
  res.redirect('/signin');
};
