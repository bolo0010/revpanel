import express from 'express';
import {
    getUserById,
    getAllUsers,
    updateUser,
    createUser,
    updateUserById,
    updateAllUsers,
    getUserBirthday,
    getCurrentUser,
    changeUserAvatar,
    getUserAvatar
} from '../controllers/users.controller.js';
import { canModifyAndSeeUsers } from '../../middlewares/check-role.js';
import { uploadAvatar } from '../../config/multer.js';
import { validateImageProperties } from '../../middlewares/check-file.js';

const router = express.Router();

router.get('/', canModifyAndSeeUsers, getAllUsers);
router.get('/current', getCurrentUser);
router.get('/birthday', getUserBirthday);
router.get('/avatar', getUserAvatar);
router.get('/:id', canModifyAndSeeUsers, getUserById);
router.post('/', canModifyAndSeeUsers, createUser);
router.patch('/', updateUser);
router.patch('/all', canModifyAndSeeUsers, updateAllUsers);
router.patch('/avatar', uploadAvatar, validateImageProperties, changeUserAvatar);
router.patch('/:id', canModifyAndSeeUsers, updateUserById);

export default router;
