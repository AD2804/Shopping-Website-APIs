const { error } = require('console');
const User = require('../models/user');
const { Sequelize } = require('../models');
const auth = require('../middleware/auth');
const upload = require('../config/multer');
const File = require('../models/file');

exports.uploadFile = async (req, res) => {
    const user_id = req.user.id;

    upload(req, res, async (err) => {
        if (err) {
            console.error('Upload error:', err);
            return res.status(400).json({ error: err.message || 'Failed to upload file.' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file selected or invalid file type.' });
        }

        try {
            const newFile = await File.create({
                uID: user_id,
                filename: req.file.filename,
                filepath: req.file.path,
                filetype: req.file.mimetype,
                filesize: req.file.size
            });

            return res.status(201).json({
                message: 'File uploaded successfully.',
                file: newFile
            });
        } catch (error) {
            console.error('Failed to save file in the database:', error);
            return res.status(500).json({ error: 'Failed to save file in the database.' });
        }
    });
};
