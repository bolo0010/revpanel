import { FailedResponses } from '../config/responses.js';

import { MAX_FILE_SIZE } from '../config/multer.js';
import { promises as fs } from 'fs';

export const validateImageProperties = async (req, res, next) => {
    const { file } = req;

    if (!file) {
        res.status(400).json({
            success: false,
            message: FailedResponses.FILE_NOT_ADDED
        });
        return;
    }

    if (file.size > MAX_FILE_SIZE) {
        await fs.unlink(req.file.path);
        res.status(400).json({
            success: false,
            message: FailedResponses.FILE_SIZE_TOO_BIG
        });
        return;
    }

    if (!file.mimetype === 'image/jpeg') {
        await fs.unlink(req.file.path);
        res.status(400).json({
            success: false,
            message: FailedResponses.FILE_TYPE_MISMATCH
        });
        return;
    }

    next();
};