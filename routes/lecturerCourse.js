const express = require('express');
const router = express.Router();
const flashInfo = require('../middlewares/flashInfo');
const controller = require('../controller/lecturerCourse');
const { checkAuthenticated, checkIsLecturer } = require('../middlewares/auth');
const multer = require('multer');
const uploadImage = multer({ dest: 'images/' });
const uploadVideo = multer({ dest: 'videos/' });

router.get('/new', checkIsLecturer, flashInfo, controller.getAddNewCourseView);
router.get('/:id', checkIsLecturer, flashInfo, controller.getCourseDetailView);
router.get('/:id/edit', checkIsLecturer, flashInfo, controller.getCourseEditorView);
router.get('/:id/sections', checkIsLecturer, flashInfo, controller.getSectionsView);
router.get('/:courseId/sections/:sectionId', checkIsLecturer, flashInfo, controller.getSectionView);

router.post('/', checkIsLecturer, uploadImage.single('avatar'), controller.addNewCourse);
router.post('/:id/sections', checkIsLecturer, controller.addNewSection);
router.post(
  '/:courseId/sections/:sectionId/lecture',
  checkIsLecturer,
  uploadVideo.single('video'),
  controller.addNewLecture
);

router.put('/:id', checkIsLecturer, uploadImage.single('avatar'), controller.updateCourse);
router.delete('/:id', checkIsLecturer, controller.deleteCourse);

module.exports = router;