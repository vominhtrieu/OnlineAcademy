const express = require('express');
const passport = require('passport');
const router = express.Router();
const flashInfo = require('../middlewares/flashInfo');
const authenticationController = require('../controller/authentication');

router.get('/signin', flashInfo, authenticationController.getSignInView);
router.get('/signup', flashInfo, authenticationController.getSignUpView);
router.get('/verify-email', authenticationController.verifyEmail);

router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: 'Tên đăng nhập hoặc mật khẩu không đúng',
  }),
  authenticationController.signIn
);
router.post('/signup', authenticationController.signUp);
router.post('/signout', authenticationController.signOut);

//Google
router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);
router.get(
  '/auth/google/redirect',
  passport.authenticate('google', {
    failureRedirect: '/signin',
    failureFlash: 'Không thể đăng nhập với Google',
    successRedirect: '/',
  })
);

//Facebook
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get(
  '/auth/facebook/redirect',
  passport.authenticate('facebook', {
    failureRedirect: '/signin',
    failureFlash: 'Không thể đăng nhập với Facebook',
    successRedirect: '/',
  })
);

module.exports = router;
