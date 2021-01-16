const express = require('express');
const router = express.Router();
const { checkIsAdmin } = require('../middlewares/auth');
const flashInfo = require('../middlewares/flashInfo');
const controller = require('../controller/adminStudent');

router.get('/', checkIsAdmin, flashInfo, controller.getStudentList);
router.put('/:id', checkIsAdmin, controller.updateStudent);
router.put('/:id/lock', checkIsAdmin, controller.lockStudent);
router.put('/:id/unlock', checkIsAdmin, controller.unlockStudent);

module.exports = router;
