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

router.post('/', checkAuthenticated, upload.single('avatar'), controller.addNewCourse);

router.put('/:id', checkAuthenticated, upload.single('avatar'), controller.updateCourse);
router.delete('/:id', checkAuthenticated, controller.deleteCourse);

module.exports = router;
