const express = require('express');
const router = express.Router();
const flashInfo = require('../middlewares/flashInfo');
const controller = require('../controller/studentCourse');
const { checkIsStudent } = require('../middlewares/auth');

router.get('/:id', flashInfo, controller.getCourseDetail);
router.get('/:courseId/sections/:sectionNo/lectures/:lectureNo', flashInfo, controller.getLecture);
router.get('/:courseId/learn', controller.learn);
router.post('/:id/enroll', checkIsStudent, controller.enrollCourse);
router.put('/:courseId/records', checkIsStudent, controller.updateRecord);

module.exports = router;
