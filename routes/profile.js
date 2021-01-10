const express = require('express');
const router = express.Router();
const controller = require('../controller/profile');
const flashInfo = require('../middlewares/flashInfo');

router.get('/', flashInfo, controller.getProfile);
router.get('/edit', flashInfo, controller.getEditProfileView);
router.put('/', flashInfo, controller.updateProfile);
router.put('/password', flashInfo, controller.changePassword);

module.exports = router;
