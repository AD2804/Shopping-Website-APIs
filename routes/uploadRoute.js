const express = require('express');
const uploadRouter = express.Router();
const auth = require('../middleware/auth');
const fileuploadController = require('../controllers/fileuploadController');

uploadRouter.use(auth);
uploadRouter.post('/create', fileuploadController.uploadFile);

module.exports = uploadRouter;