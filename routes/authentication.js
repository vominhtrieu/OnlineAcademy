const express = require('express');
const passport = require('passport');
const router = express.Router();
const flashInfo = require('../middlewares/flashInfo');
const authenticationController = require('../controller/authentication');

router.get('/signin', flashInfo, authenticationController.getSignInView);
router.get('/signup', flashInfo, authenticationController.getSignUpView);

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

module.exports = router;
