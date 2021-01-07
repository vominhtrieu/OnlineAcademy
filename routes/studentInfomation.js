const express = require('express');
const router = express.Router();
const controller = require('../controller/studentInfomation');
const flashInfo = require('../middlewares/flashInfo');

router.get('/my-courses', flashInfo, controller.getMyCourses);

module.exports = router;
