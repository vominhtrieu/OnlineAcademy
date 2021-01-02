const express = require('express');
const router = express.Router();
const flashInfo = require('../middlewares/flashInfo');
const controller = require('../controller/lecturerCourse');
const { checkAuthenticated } = require('../middlewares/auth');
const multer = require('multer');
const upload = multer({ dest: 'images/' });

router.get('/new', checkAuthenticated, flashInfo, controller.getAddNewCourseView);
router.get('/:id', checkAuthenticated, flashInfo, controller.getCourseDetailView);
router.get('/:id/edit', checkAuthenticated, flashInfo, controller.getCourseEditorView);
router.get('/:id/sections', checkAuthenticated, flashInfo, controller.getSectionsView);

router.post('/', checkAuthenticated, upload.single('avatar'), controller.addNewCourse);
router.post('/:id/sections', checkAuthenticated, controller.addNewSection);

router.put('/:id', checkAuthenticated, upload.single('avatar'), controller.updateCourse);
router.delete('/:id', checkAuthenticated, controller.deleteCourse);

module.exports = router;
