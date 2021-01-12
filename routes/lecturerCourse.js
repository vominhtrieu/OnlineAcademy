const express = require('express');
const router = express.Router();
const flashInfo = require('../middlewares/flashInfo');
const controller = require('../controller/lecturerCourse');
const { checkIsLecturer } = require('../middlewares/auth');
const multer = require('multer');
const uploadImage = multer({ dest: 'images/' });
const uploadVideo = multer({ dest: 'videos/' });

//Course info
router.get('/new', checkIsLecturer, flashInfo, controller.getAddNewCourseView);
router.get('/:courseId', checkIsLecturer, flashInfo, controller.getCourseDetailView);

router.post('/', checkIsLecturer, uploadImage.single('avatar'), controller.addNewCourse);
router.get('/:courseId/edit', checkIsLecturer, flashInfo, controller.getCourseEditorView);
router.put('/:courseId', checkIsLecturer, uploadImage.single('avatar'), controller.updateCourse);
router.delete('/:courseId', checkIsLecturer, controller.deleteCourse);

//Section
router.get('/:courseId/sections', checkIsLecturer, flashInfo, controller.getSectionsView);
router.get('/:courseId/sections/:sectionId', checkIsLecturer, flashInfo, controller.getSectionView);
router.post('/:courseId/sections', checkIsLecturer, controller.addNewSection);
router.put('/:courseId/sections/:sectionId', checkIsLecturer, controller.updateSection);
router.delete('/:courseId/sections/:sectionId', checkIsLecturer, controller.deleteSection);

//Lecture
router.post(
  '/:courseId/sections/:sectionId/lecture',
  checkIsLecturer,
  uploadVideo.single('video'),
  controller.addNewLecture
);
router.put(
  '/:courseId/sections/:sectionId/lecture/:lectureId',
  checkIsLecturer,
  uploadVideo.single('video'),
  controller.updateLecture
);

router.delete('/:courseId/sections/:sectionId/lecture/:lectureId', checkIsLecturer, controller.deleteLecture);

module.exports = router;
