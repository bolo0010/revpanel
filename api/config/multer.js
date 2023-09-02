import path, { dirname } from 'path';
import { v4 as uuid } from 'uuid';
import multer from 'multer';
import mime from 'mime-types';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const MAX_FILE_SIZE = 2097152;

// export const PATH_TO_IMAGES = path.join('/home/', '/okamikya/', '/domains/', '/arturmaslowski.pl/', '/public_html', '/assets/', '/img/')
export const PATH_TO_IMAGES = path.join(__dirname, '/../', '/assets/', '/img/');

const filename = {
    filename: function (req, file, cb) {
        cb(null, uuid() + '.' + mime.extension(file.mimetype));
    }
};

const destination_avatar = {
    destination: function (req, file, cb) {
        cb(null, PATH_TO_IMAGES);
    }
};

const storage_avatar = multer.diskStorage({
    ...destination_avatar,
    ...filename
});

const destinationAvatar = multer({ storage: storage_avatar });

export const uploadAvatar = (req, res, next) => {
    destinationAvatar.single('avatar')(req, res, next);
};