const express = require('express');
const router = express.Router();
const flashInfo = require('../middlewares/flashInfo');
const controller = require('../controller/lecturerCourse');
const { checkIsLecturer } = require('../middlewares/auth');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/new', checkIsLecturer, flashInfo, controller.getAddNewCourseView);
router.get('/:id', checkIsLecturer, flashInfo, controller.getCourseDetailView);
router.get('/:id/edit', checkIsLecturer, flashInfo, controller.getCourseEditorView);
router.get('/:id/sections', checkIsLecturer, flashInfo, controller.getSectionsView);
router.get('/:courseId/sections/:sectionId', checkIsLecturer, flashInfo, controller.getSectionView);

router.post('/', checkIsLecturer, upload.single('avatar'), controller.addNewCourse);
router.post('/:id/sections', checkIsLecturer, controller.addNewSection);
router.post(
  '/:courseId/sections/:sectionId/lecture',
  checkIsLecturer,
  upload.single('video'),
  controller.addNewLecture
);

router.put('/:id', checkIsLecturer, upload.single('avatar'), controller.updateCourse);
router.delete('/:id', checkIsLecturer, controller.deleteCourse);

module.exports = router;
