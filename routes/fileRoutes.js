const express = require('express');
const multer = require('multer');
const { uploadFile, getUploads } = require('../controllers/fileController');
const authMiddleware = require('../middlewares/authMiddleware');

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/upload', authMiddleware, upload.single('file'), uploadFile);
router.get('/', authMiddleware, getUploads);

module.exports = router;
