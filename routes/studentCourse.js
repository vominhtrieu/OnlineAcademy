const express = require('express');
const router = express.Router();
const { checkIsLecturer, checkIsAccepted } = require('../middlewares/auth');
const flashInfo = require('../middlewares/flashInfo');
const controller = require('../controller/lecturerDashboard');

router.get('/', checkIsLecturer, flashInfo, controller.getDashboard);

module.exports = router;
