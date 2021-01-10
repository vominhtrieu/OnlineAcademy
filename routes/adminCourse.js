const express = require('express');
const router = express.Router();
const { checkIsAdmin } = require('../middlewares/auth');
const flashInfo = require('../middlewares/flashInfo');
const controller = require('../controller/adminCourse');

router.get('/', checkIsAdmin, flashInfo, controller.getCourseList);
router.delete('/:id', checkIsAdmin, controller.deleteCourse);

module.exports = router;
