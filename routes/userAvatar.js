const { Router } = require('express');

const express = require('express');
const router = express.Router();
const controller = require('../controller/userAvatar');
const multer = require('multer');
const upload = multer({ dest: 'images/' });

router.put('/', upload.single('avatar'), controller.updateAvatar);

module.exports = router;
